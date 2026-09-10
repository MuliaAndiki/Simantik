package telemetry

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"
	"go.opentelemetry.io/otel/propagation"
	"go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.26.0"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

// Config defines telemetry configuration parameters.
type Config struct {
	Enabled        bool
	ServiceName    string
	ServiceVersion string
	Environment    string
	Endpoint       string // e.g. "jaeger:4317" or "localhost:4317"
	Insecure       bool
}

// InitTracer configures and initializes OpenTelemetry TracerProvider.
// It returns a shutdown cleanup function.
func InitTracer(ctx context.Context, cfg Config) (func(context.Context) error, error) {
	if !cfg.Enabled || cfg.Endpoint == "" {
		log.Println("telemetry: OpenTelemetry tracing is disabled")
		return func(context.Context) error { return nil }, nil
	}

	if cfg.ServiceName == "" {
		cfg.ServiceName = "simantik-api"
	}
	if cfg.ServiceVersion == "" {
		cfg.ServiceVersion = "1.0.0"
	}

	res, err := resource.New(ctx,
		resource.WithAttributes(
			semconv.ServiceNameKey.String(cfg.ServiceName),
			semconv.ServiceVersionKey.String(cfg.ServiceVersion),
			semconv.DeploymentEnvironmentKey.String(cfg.Environment),
		),
		resource.WithProcess(),
		resource.WithOS(),
		resource.WithHost(),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create otel resource: %w", err)
	}

	dialOpts := []grpc.DialOption{}
	if cfg.Insecure {
		dialOpts = append(dialOpts, grpc.WithTransportCredentials(insecure.NewCredentials()))
	}

	exporterCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	exporter, err := otlptracegrpc.New(exporterCtx,
		otlptracegrpc.WithEndpoint(cfg.Endpoint),
		otlptracegrpc.WithInsecure(),
		otlptracegrpc.WithDialOption(dialOpts...),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create otlp trace exporter: %w", err)
	}

	bsp := sdktrace.NewBatchSpanProcessor(exporter)
	tp := sdktrace.NewTracerProvider(
		sdktrace.WithSampler(sdktrace.AlwaysSample()),
		sdktrace.WithResource(res),
		sdktrace.WithSpanProcessor(bsp),
	)

	otel.SetTracerProvider(tp)
	otel.SetTextMapPropagator(propagation.NewCompositeTextMapPropagator(
		propagation.TraceContext{},
		propagation.Baggage{},
	))

	log.Printf("telemetry: OpenTelemetry tracer initialized (service: %s, endpoint: %s)", cfg.ServiceName, cfg.Endpoint)

	shutdown := func(shutdownCtx context.Context) error {
		var errs []error
		if err := tp.Shutdown(shutdownCtx); err != nil {
			errs = append(errs, fmt.Errorf("tracer provider shutdown error: %w", err))
		}
		if len(errs) > 0 {
			return fmt.Errorf("telemetry shutdown errors: %v", errs)
		}
		return nil
	}

	return shutdown, nil
}
