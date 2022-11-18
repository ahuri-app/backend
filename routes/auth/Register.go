package routes_auth

import (
	"backend/dbModels"
	reqBodyModels_auth "backend/reqBodyModels/auth"
	"backend/utils"
	utils_crypto "backend/utils/crypto"

	"fmt"

	"github.com/gin-gonic/gin"
)

func generateNonConflictingTag(username string) string {
	db, _ := utils.Db()
	generatedTag := utils.GenerateTag()
	if db.Where("username = ?", username).Where("tag = ?", generatedTag).First(&dbModels.User{}).Error == nil {
		return generateNonConflictingTag(username)
	}
	return generatedTag
}

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

	trimmedEmail := utils.Trim(reqBody.Email)
	trimmedUsername := utils.Trim(reqBody.Username)
	trimmedPassword := utils.Trim(reqBody.Password)

	if trimmedEmail == "" {
		c.JSON(400, gin.H{"message": "Email not set", "payload": nil})
		return
	}
	if trimmedUsername == "" {
		c.JSON(400, gin.H{"message": "Username not set", "payload": nil})
		return
	}
	if trimmedPassword == "" {
		c.JSON(400, gin.H{"message": "Password not set", "payload": nil})
		return
	}

	err = db.First(&dbModels.User{}, "email = ?", trimmedEmail).Error
	if err == nil {
		c.JSON(409, gin.H{"message": "Email already used", "payload": nil})
		return
	}

	newEid := utils.GenerateEid()
	newToken := utils.GenerateToken()
	newTag := generateNonConflictingTag(trimmedUsername)
	hashedPassword := utils_crypto.Hash(utils_crypto.Salt(trimmedPassword))

	if len(trimmedUsername) > 32 || len(trimmedUsername) < 3 {
		c.JSON(400, gin.H{"message": "Username must be at least 3 characters and less than 32 characters", "payload": nil})
		return
	}
	if len(trimmedPassword) < 8 || len(trimmedPassword) > 128 {
		c.JSON(400, gin.H{"message": "Password must be at least 8 characters and less than 128 characters", "payload": nil})
		return
	}

	db.Create(&dbModels.User{
		Eid:      newEid,
		Username: trimmedUsername,
		Tag:      newTag,
		Email:    trimmedEmail,
		Password: hashedPassword,
		Token:    newToken,
	})

	c.JSON(200, gin.H{"message": "Success", "payload": gin.H{"id": newEid, "email": trimmedEmail, "username": trimmedUsername, "tag": newTag, "token": newToken}})
}
