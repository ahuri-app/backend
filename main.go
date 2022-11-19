package main

import (
	"fmt"
	"os"
	"time"

	"github.com/gin-gonic/gin"

	"backend/dbModels"
	"backend/middleware"
	routes_auth "backend/routes/auth"
	"backend/utils"
)

func main() {
	fmt.Println("Checking environment variables...")
	if os.Getenv("DB_PATH") == "" {
		fmt.Println("DB_PATH is not set!")
		os.Exit(1)
	}
	if os.Getenv("PORT") == "" {
		fmt.Println("PORT is not set!")
		os.Exit(1)
	}
	if os.Getenv("SALT") == "" {
		fmt.Println("SALT is not set!")
		os.Exit(1)
	}

	fmt.Println("Configuring DB and GORM...")
	db, err := utils.Db()
	if err != nil {
		fmt.Println("Error!", err)
		os.Exit(1)
	}
	db.AutoMigrate(&dbModels.User{})
	db.AutoMigrate(&dbModels.Channel{})

	fmt.Println("Configuring Gin server...")
	gin.SetMode(gin.ReleaseMode)
	server := gin.New()
	server.Use(middleware.Cors)
	server.Use(middleware.CommonHeaders)
	server.POST("/auth/register", middleware.Ratelimiter(time.Minute, 20), routes_auth.Register)
	server.POST("/auth/login", middleware.Ratelimiter(time.Minute, 30), routes_auth.Login)

	fmt.Println("Starting server...")
	server.Run("0.0.0.0:" + os.Getenv("PORT"))
}
