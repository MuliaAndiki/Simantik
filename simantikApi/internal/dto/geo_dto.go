package dto

type GeoPlace struct {
	Name        string  `json:"name"`
	DisplayName string  `json:"displayName"`
	Latitude    float64 `json:"latitude"`
	Longitude   float64 `json:"longitude"`
	Provinsi    string  `json:"provinsi"`
	Kabupaten   string  `json:"kabupaten"`
	Kecamatan   string  `json:"kecamatan"`
}
