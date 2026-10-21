package utils

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"
)

// GoogleClaims holds the verified profile claims returned from Google.
type GoogleClaims struct {
	Sub     string `json:"sub"`
	Email   string `json:"email"`
	Name    string `json:"name"`
	Picture string `json:"picture"`
}

// GoogleVerifier defines the interface for server-side Google ID token verification.
type GoogleVerifier interface {
	Verify(ctx context.Context, idToken string) (*GoogleClaims, error)
}

type googleVerifier struct {
	clientID   string
	httpClient *http.Client
}

// NewGoogleVerifier creates a Google ID token verifier.
func NewGoogleVerifier(clientID string) GoogleVerifier {
	return &googleVerifier{
		clientID: clientID,
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

type googleTokenInfoResponse struct {
	Aud           string `json:"aud"`
	Sub           string `json:"sub"`
	Email         string `json:"email"`
	EmailVerified string `json:"email_verified"`
	Name          string `json:"name"`
	Picture       string `json:"picture"`
	Error         string `json:"error_description"`
}

func (g *googleVerifier) Verify(ctx context.Context, idToken string) (*GoogleClaims, error) {
	if idToken == "" {
		return nil, errors.New("idToken is required")
	}

	endpoint := fmt.Sprintf("https://oauth2.googleapis.com/tokeninfo?id_token=%s", idToken)

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create Google verification request: %w", err)
	}

	resp, err := g.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to Google authentication server: %w", err)
	}
	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode != http.StatusOK {
		return nil, errors.New("invalid or expired Google token")
	}

	var info googleTokenInfoResponse
	if err := json.NewDecoder(resp.Body).Decode(&info); err != nil {
		return nil, fmt.Errorf("failed to decode Google token response: %w", err)
	}

	if info.Error != "" {
		return nil, fmt.Errorf("google verification error: %s", info.Error)
	}

	// Verify audience if ClientID is configured in environment
	if g.clientID != "" && info.Aud != g.clientID {
		return nil, errors.New("token was not issued for this application client ID")
	}

	if info.Sub == "" || info.Email == "" {
		return nil, errors.New("incomplete claims returned by Google")
	}

	return &GoogleClaims{
		Sub:     info.Sub,
		Email:   info.Email,
		Name:    info.Name,
		Picture: info.Picture,
	}, nil
}
