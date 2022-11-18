package main

import (
	"fmt"
	"os"

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
	db, err := utils.Db()
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
	server.POST("/auth/login", routes_auth.Login)

	fmt.Println("Starting server...")
	server.Run("0.0.0.0:" + os.Getenv("PORT"))
}
