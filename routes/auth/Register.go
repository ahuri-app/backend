package routes_auth

import (
	"backend/dbModels"
	reqBodyModels_auth "backend/reqBodyModels/auth"
	"backend/utils"
	utils_crypto "backend/utils/crypto"

	"fmt"

	"github.com/gin-gonic/gin"
)

func Register(c *gin.Context) {
	db, err := utils.Db()
	if err != nil {
		fmt.Println("DB open error! (/auth/register)\nDetails:", err)
		c.JSON(500, gin.H{"message": "Internal server error", "payload": nil})
		return
	}

	reqBody := reqBodyModels_auth.Register{}
	err = c.BindJSON(&reqBody)
	if err != nil {
		fmt.Println("BindJSON error! (/auth/register)\nDetails:", err)
		c.JSON(500, gin.H{"message": "Internal server error", "payload": nil})
		return
	}

	if reqBody.Email == "" {
		c.JSON(400, gin.H{"message": "Email not set", "payload": nil})
		return
	}
	if reqBody.Username == "" {
		c.JSON(400, gin.H{"message": "Username not set", "payload": nil})
		return
	}
	if reqBody.Password == "" {
		c.JSON(400, gin.H{"message": "Password not set", "payload": nil})
		return
	}

	err = db.First(&dbModels.User{}, "email = ?", reqBody.Email).Error
	if err == nil {
		c.JSON(409, gin.H{"message": "Email already used", "payload": nil})
		return
	}

	newEid := utils.GenerateEid()
	newToken := utils.GenerateToken()
	hashedPassword := utils_crypto.Hash(utils_crypto.Salt(reqBody.Password))

	if len(reqBody.Username) > 32 || len(reqBody.Username) < 3 {
		c.JSON(400, gin.H{"message": "Username must be more than 3 chars and less than 32 chars", "payload": nil})
		return
	}
	if len(reqBody.Password) < 8 || len(reqBody.Password) > 128 {
		c.JSON(400, gin.H{"message": "Password must be at least 8 chars and less than 128 chars", "payload": nil})
		return
	}

	db.Create(&dbModels.User{
		Eid:      newEid,
		Username: reqBody.Username,
		Email:    reqBody.Email,
		Password: hashedPassword,
		Token:    newToken,
	})

	c.JSON(200, gin.H{"message": "Success", "payload": gin.H{"token": newToken}})
}
