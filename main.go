package main

import (
	"fmt"
	"os"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"backend/dbModels"
	"backend/middleware"
	routes_auth "backend/routes/auth"
)

func main() {
	fmt.Println("Checking environment variables...")
	if os.Getenv("DB_PATH") == "" {
		fmt.Println("DB_PATH is not set!")
		return
	}
	if os.Getenv("PORT") == "" {
		fmt.Println("PORT is not set!")
		return
	}
	if os.Getenv("SALT") == "" {
		fmt.Println("SALT is not set!")
		return
	}

	fmt.Println("Configuring DB and GORM...")
	db, err := gorm.Open(sqlite.Open(os.Getenv("DB_PATH")), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		fmt.Println("Error!", err)
		return
	}
	db.AutoMigrate(&dbModels.User{})
	db.AutoMigrate(&dbModels.Channel{})

	fmt.Println("Configuring gin server...")
	gin.SetMode(gin.ReleaseMode)
	server := gin.New()
	server.Use(middleware.Cors)
	server.Use(middleware.CommonHeaders)
	server.POST("/auth/register", routes_auth.Register)

	fmt.Println("Starting server...\nServer started")
	server.Run("0.0.0.0:" + os.Getenv("PORT"))
}
