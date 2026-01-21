package domain

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

// Enums

type DocumentStatus string

const (
	DocumentStatusDraft     DocumentStatus = "DRAFT"
	DocumentStatusReview    DocumentStatus = "REVIEW"
	DocumentStatusPublished DocumentStatus = "PUBLISHED"
)

// ==================
// Structs
// ==================

// User
type User struct {
	ID             uuid.UUID
	Username       string
	Email          string
	Name           string
	AuthProviderID string
	CreatedAt      time.Time
	UpdatedAt      time.Time
	DeletedAt      *time.Time `gorm:"index"`
}

type CreateUserRequest struct {
	Username       string `json:"username" binding:"required"`
	Name           string `json:"name" binding:"required"`
	Email          string `json:"email" binding:"required"`
	AuthProviderID string `json:"auth_provider_id" binding:"optional"`
	Password       string `json:"password" binding:"required"`
}

type UpdateUserRequest struct {
	Username       string `json:"username" binding:"optional"`
	Name           string `json:"name" binding:"optional"`
	Email          string `json:"email" binding:"optional"`
	AuthProviderID string `json:"auth_provider_id" binding:"optional"`
	Password       string `json:"password" binding:"optional"`
}

// Authentication
type AuthToken struct {
	UserID    int
	Token     string
	CreatedAt time.Time
}

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type Response struct {
	Status  string `json:"status"`
	Message string `json:"message"`
	Data    any    `json:"data,omitempty"`
}

type Claims struct {
	UserID   int
	Username string
	jwt.RegisteredClaims
}
