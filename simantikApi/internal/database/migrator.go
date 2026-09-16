package database

import (
	"fmt"
	"strings"
	"time"

	"gorm.io/gorm"
	"gorm.io/gorm/schema"
)

// ColumnAddition represents a column present in the GORM model but missing in the DB.
type ColumnAddition struct {
	Table    string
	Column   string
	DataType string
}

// UnmappedColumn represents a column existing in the DB but absent from the GORM model.
type UnmappedColumn struct {
	Table  string
	Column string
}

// PotentialRename represents a suspected column rename where a DB column is unmapped
// and a new model column is simultaneously introduced on the same table.
type PotentialRename struct {
	Table      string
	DBColumn   string
	ModelField string
}

// SchemaInspectionReport encapsulates the pre-migration inspection findings.
type SchemaInspectionReport struct {
	TotalModels       int
	ExistingTables    []string
	TablesToCreate    []string
	ColumnsToAdd      []ColumnAddition
	UnchangedTables   []string
	UnmappedDBColumns []UnmappedColumn
	PotentialRenames  []PotentialRename
	Warnings          []string
}

// MigrationResult summarizes the completed migration run.
type MigrationResult struct {
	ModelsChecked int
	TablesCreated int
	ColumnsAdded  int
	WarningsCount int
	Duration      time.Duration
	Success       bool
}

// SafeMigrator executes non-destructive schema synchronization using GORM AutoMigrate.
type SafeMigrator struct {
	db     *gorm.DB
	models []interface{}
}

// NewSafeMigrator initializes a new SafeMigrator instance.
func NewSafeMigrator(db *gorm.DB, models []interface{}) *SafeMigrator {
	return &SafeMigrator{
		db:     db,
		models: models,
	}
}

// Inspect scans the current database schema against all registered models
// to detect new tables, new columns, unmapped columns, and possible renames.
func (m *SafeMigrator) Inspect() (*SchemaInspectionReport, error) {
	report := &SchemaInspectionReport{
		TotalModels: len(m.models),
	}

	for _, model := range m.models {
		stmt := &gorm.Statement{DB: m.db}
		if err := stmt.Parse(model); err != nil {
			return nil, fmt.Errorf("failed to parse schema for model %T: %w", model, err)
		}
		tableName := stmt.Schema.Table

		// Check if table exists
		if !m.db.Migrator().HasTable(model) {
			report.TablesToCreate = append(report.TablesToCreate, tableName)
			continue
		}

		report.ExistingTables = append(report.ExistingTables, tableName)

		// Fetch existing columns in the live database table
		colTypes, err := m.db.Migrator().ColumnTypes(model)
		if err != nil {
			return nil, fmt.Errorf("failed to inspect columns for table '%s': %w", tableName, err)
		}

		dbCols := make(map[string]gorm.ColumnType, len(colTypes))
		for _, ct := range colTypes {
			dbCols[strings.ToLower(ct.Name())] = ct
		}

		// Extract fields defined in the GORM model
		modelFields := make(map[string]*schema.Field)
		for _, field := range stmt.Schema.Fields {
			if field.DBName != "" {
				modelFields[strings.ToLower(field.DBName)] = field
			}
		}

		// 1. Detect missing columns in the database (columns to add)
		var newColsInTable []string
		for dbName, field := range modelFields {
			if _, exists := dbCols[dbName]; !exists {
				report.ColumnsToAdd = append(report.ColumnsToAdd, ColumnAddition{
					Table:    tableName,
					Column:   field.DBName,
					DataType: string(field.DataType),
				})
				newColsInTable = append(newColsInTable, field.DBName)
			}
		}

		// 2. Detect unmapped columns in the database (not in model)
		var unmappedInTable []string
		for dbCol := range dbCols {
			if _, exists := modelFields[dbCol]; !exists {
				report.UnmappedDBColumns = append(report.UnmappedDBColumns, UnmappedColumn{
					Table:  tableName,
					Column: dbCol,
				})
				unmappedInTable = append(unmappedInTable, dbCol)
				report.Warnings = append(report.Warnings, fmt.Sprintf(
					"Unmapped database column detected: %s.%s (The column will NOT be removed automatically)",
					tableName, dbCol,
				))
			}
		}

		// 3. Detect potential column renames
		if len(newColsInTable) > 0 && len(unmappedInTable) > 0 {
			for _, unmapped := range unmappedInTable {
				for _, newCol := range newColsInTable {
					report.PotentialRenames = append(report.PotentialRenames, PotentialRename{
						Table:      tableName,
						DBColumn:   unmapped,
						ModelField: newCol,
					})
					report.Warnings = append(report.Warnings, fmt.Sprintf(
						"Possible rename detected in table '%s': Database '%s.%s' vs Model '%s.%s'. "+
							"AutoMigrate will not safely infer this rename. Create an explicit migration if a rename was intended.",
						tableName, tableName, unmapped, tableName, newCol,
					))
				}
			}
		}

		// 4. Mark unchanged tables
		if len(newColsInTable) == 0 {
			report.UnchangedTables = append(report.UnchangedTables, tableName)
		}
	}

	return report, nil
}

// PrintInspection outputs the formatted schema inspection results to the console.
func (m *SafeMigrator) PrintInspection(report *SchemaInspectionReport) {
	fmt.Println("[MIGRATION] Inspecting database schema...")

	if len(report.TablesToCreate) > 0 {
		fmt.Println("\n[CREATE TABLE]")
		for _, tbl := range report.TablesToCreate {
			fmt.Printf("  + %s\n", tbl)
		}
	}

	if len(report.ColumnsToAdd) > 0 {
		fmt.Println("\n[ADD COLUMN]")
		for _, col := range report.ColumnsToAdd {
			if col.DataType != "" {
				fmt.Printf("  + %s.%s (%s)\n", col.Table, col.Column, col.DataType)
			} else {
				fmt.Printf("  + %s.%s\n", col.Table, col.Column)
			}
		}
	}

	if len(report.UnchangedTables) > 0 {
		fmt.Println("\n[UNCHANGED]")
		for _, tbl := range report.UnchangedTables {
			fmt.Printf("  = %s\n", tbl)
		}
	}

	if len(report.Warnings) > 0 {
		fmt.Println("\n[WARNINGS]")
		for _, warn := range report.Warnings {
			fmt.Printf("  ! %s\n", warn)
		}
	}
}

// Migrate executes GORM AutoMigrate safely model by model.
// Non-destructive rules:
// - CREATE TABLE, ADD COLUMN, CREATE INDEX, CREATE FOREIGN KEY are performed safely by GORM.
// - DROP TABLE, DROP COLUMN, DELETE DATA, TRUNCATE are strictly NEVER executed.
func (m *SafeMigrator) Migrate(report *SchemaInspectionReport) (*MigrationResult, error) {
	start := time.Now()
	fmt.Println("\n[MIGRATION] Running GORM AutoMigrate...")

	for _, model := range m.models {
		stmt := &gorm.Statement{DB: m.db}
		_ = stmt.Parse(model)
		tableName := stmt.Schema.Table

		if err := m.db.AutoMigrate(model); err != nil {
			return nil, fmt.Errorf("migration failed for model %T (table '%s'): %w", model, tableName, err)
		}
		fmt.Printf("  ✓ %s\n", tableName)
	}

	return &MigrationResult{
		ModelsChecked: len(m.models),
		TablesCreated: len(report.TablesToCreate),
		ColumnsAdded:  len(report.ColumnsToAdd),
		WarningsCount: len(report.Warnings),
		Duration:      time.Since(start),
		Success:       true,
	}, nil
}

// PrintSummary outputs a structured summary of the migration run.
func (m *SafeMigrator) PrintSummary(res *MigrationResult) {
	fmt.Println("\n========================================")
	fmt.Println("Migration Summary")
	fmt.Println("========================================")
	fmt.Printf("Models checked : %d\n", res.ModelsChecked)
	fmt.Printf("Tables created : %d\n", res.TablesCreated)
	fmt.Printf("Columns added  : %d\n", res.ColumnsAdded)
	fmt.Printf("Warnings       : %d\n", res.WarningsCount)
	fmt.Printf("Duration       : %s\n", res.Duration.Round(time.Millisecond))
	if res.Success {
		fmt.Println("Status         : SUCCESS")
	} else {
		fmt.Println("Status         : FAILED")
	}
	fmt.Println("========================================")
}
