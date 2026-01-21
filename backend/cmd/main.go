package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/devherik/security-incidents-project/internal/api/middleware"
	"github.com/devherik/security-incidents-project/internal/config"
)

func main() {
	// Load configuration
	cfg := config.New()

	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	} else {
		gin.SetMode(gin.DebugMode)
	}

	dbUrl := cfg.DatabaseURL
	if dbUrl == "" {
		panic("Database config is not set")
	}
	log.Printf("Connecting to database at %s", dbUrl)
	// Initializa Repo or DB connection here if needed

	// Close DB connection on exit
	// defer db.Close()

	r := gin.New()

	r.Use(gin.Recovery())
	r.Use(middleware.ErrorHandler())
	r.Use(middleware.Logger())
	r.Use(middleware.Auth(cfg))
	r.Use(middleware.SetupCORS(cfg))

	r.GET("/status", StatusHandler)

	srv := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      r,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	log.Printf("Starting server on port %s", cfg.Port)
	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("listen: %s\n", err)
	}
}

func StatusHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status": "Server is running",
	})
}
