# ---- Builder ---------------------------------------------------------------
FROM golang:1.25-alpine AS builder

RUN apk add --no-cache ca-certificates

WORKDIR /src

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -ldflags="-s -w" -o /out/api ./cmd/api

# ---- Runtime ----------------------------------------------------------------
FROM alpine:3.19 AS runtime

# ca-certificates is required for TLS to Neon (sslmode=require).
RUN apk add --no-cache ca-certificates tzdata && \
    addgroup -S app && adduser -S app -G app

WORKDIR /app

COPY --from=builder /out/api ./api

USER app

EXPOSE 8080

ENTRYPOINT ["./api"]
