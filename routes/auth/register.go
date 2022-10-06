package routes_auth

import (
	"backend/dbModels"
	"backend/utils"

	"crypto/sha512"
	"encoding/hex"
	"fmt"
	"os"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func Register(c *gin.Context) {
	type reqBody struct {
		Email    string `json:"email"`
		Username string `json:"username"`
		Password string `json:"password"`
	}

	db, err := gorm.Open(sqlite.Open(os.Getenv("DB_PATH")), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		fmt.Println("DB open error! (/auth/register)\nDetails:", err)
		c.JSON(500, gin.H{"message": "Internal server error", "payload": nil})
		return
	}

	body := reqBody{}
	err = c.BindJSON(&body)
	if err != nil {
		fmt.Println("BindJSON error! (/auth/register)\nDetails:", err)
		c.JSON(500, gin.H{"message": "Internal server error", "payload": nil})
		return
	}

	if body.Email == "" {
		c.JSON(400, gin.H{"message": "Email not set", "payload": nil})
		return
	}
	if body.Username == "" {
		c.JSON(400, gin.H{"message": "Username not set", "payload": nil})
		return
	}
	if body.Password == "" {
		c.JSON(400, gin.H{"message": "Password not set", "payload": nil})
		return
	}

	err = db.First(&dbModels.User{}, "email = ?", body.Email).Error
	if err == nil {
		c.JSON(409, gin.H{"message": "Email already used", "payload": nil})
		return
	}

	newAid := utils.GenerateAid()
	newToken := utils.GenerateToken()
	hashedPasswordBytes := sha512.Sum512([]byte(body.Password + os.Getenv("SALT")))
	hashedPassword := hex.EncodeToString(hashedPasswordBytes[:])

	if len(body.Username) > 32 {
		c.JSON(400, gin.H{"message": "Username must be 32 chars or less", "payload": nil})
		return
	}
	if len(body.Password) < 8 || len(body.Password) > 128 {
		c.JSON(400, gin.H{"message": "Password must be at least 8 chars and 128 chars max", "payload": nil})
		return
	}

	db.Create(&dbModels.User{
		Username: body.Username,
		Email:    body.Email,
		Password: hashedPassword,
		Aid:      newAid,
		Token:    newToken,
	})

	c.JSON(200, gin.H{"message": "Success", "payload": gin.H{"token": newToken}})
}
