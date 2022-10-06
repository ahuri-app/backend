package routes_auth

import (
	"backend/dbModels"

	"crypto/sha512"
	"encoding/hex"
	"fmt"
	"os"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func Login(c *gin.Context) {
	type reqBody struct {
		Email    string `json:"email"`
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
	if body.Password == "" {
		c.JSON(400, gin.H{"message": "Password not set", "payload": nil})
		return
	}

	hashedPasswordBytes := sha512.Sum512([]byte(body.Password + os.Getenv("SALT")))
	hashedPassword := hex.EncodeToString(hashedPasswordBytes[:])

	accountData := dbModels.User{}
	result := db.Where(&dbModels.User{}, "email = ?", body.Email).Where(&dbModels.User{}, "password = ?", hashedPassword).Find(&accountData)
	if result.Error != nil {
		c.JSON(401, gin.H{"message": "Incorrect credentials", "payload": nil})
		return
	}

	c.JSON(200, gin.H{"message": "Success", "payload": gin.H{"token": accountData.Token}})
}
