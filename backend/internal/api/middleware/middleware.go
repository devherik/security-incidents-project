package middleware

import (
	"log"
	"time"

	"github.com/devherik/security-incidents-project/internal/config"
	"github.com/devherik/security-incidents-project/internal/core/domain"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// SetupCORS configures CORS middleware with proper security settings
func SetupCORS(cfg *config.Config) gin.HandlerFunc {
	config := cors.Config{
		AllowCredentials: true,
		AllowMethods:     []string{"GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		MaxAge:           12 * time.Hour,
	}

	// Allow all origins only in development, otherwise use configured origins
	if cfg.Environment == "development" {
		config.AllowAllOrigins = true
	} else {
		config.AllowOrigins = cfg.AllowedOrigins
	}

	return cors.New(config)
}

// Auth middleware validates JWT tokens
func Auth(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		// Validate Authorization header
		if authHeader == "" {
			c.JSON(401, gin.H{"error": "unauthorized", "message": "Authorization header is required"})
			c.Abort()
			return
		}

		tokenString := authHeader[len("Bearer "):]
		claims := &domain.Claims{}

		token, err := jwt.ParseWithClaims(tokenString, claims, func(tokenString *jwt.Token) (any, error) {
			return []byte(cfg.JWTKey), nil
		})

		// Validate token
		if err != nil || !token.Valid {
			c.JSON(401, gin.H{"error": "unauthorized", "message": "Invalid or expired token"})
			c.Abort()
			return
		}

		// Set user ID in context
		c.Set("userID", claims.UserID)
		c.Next()
	}
}

// Logger provides structured logging for requests
func Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		raw := c.Request.URL.RawQuery

		// Process request
		c.Next()

		// Log details
		latency := time.Since(start)
		clientIP := c.ClientIP()
		method := c.Request.Method
		statusCode := c.Writer.Status()

		if raw != "" {
			path = path + "?" + raw
		}

		log.Printf("[%s] %s %s %d %v",
			method,
			path,
			clientIP,
			statusCode,
			latency,
		)
	}
}

// ErrorHandler handles panic recovery and error responses
func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if err := recover(); err != nil {
				log.Printf("Panic recovered: %v", err)
				c.JSON(500, gin.H{
					"error":   "internal_server_error",
					"message": "An unexpected error occurred",
				})
				c.Abort()
			}
		}()
		c.Next()
	}
}
