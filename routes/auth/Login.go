package routes_auth

import (
	"backend/dbModels"
	reqBodyModels_auth "backend/reqBodyModels/auth"
	"backend/utils"
	utils_crypto "backend/utils/crypto"

	"fmt"

	"github.com/gin-gonic/gin"
)

func Login(c *gin.Context) {
	db, err := utils.Db()
	if err != nil {
		fmt.Println("DB open error! (/auth/login)\nDetails:", err)
		c.JSON(500, gin.H{"message": "Internal server error", "payload": nil})
		return
	}

	reqBody := reqBodyModels_auth.Login{}
	err = c.BindJSON(&reqBody)
	if err != nil {
		fmt.Println("BindJSON error! (/auth/login)\nDetails:", err)
		c.JSON(500, gin.H{"message": "Internal server error", "payload": nil})
		return
	}

	trimmedEmail := utils.Trim(reqBody.Email)
	trimmedPassword := utils.Trim(reqBody.Password)

	if trimmedEmail == "" {
		c.JSON(400, gin.H{"message": "Email not set", "payload": nil})
		return
	}
	if trimmedPassword == "" {
		c.JSON(400, gin.H{"message": "Password not set", "payload": nil})
		return
	}

	hashedPassword := utils_crypto.Hash(utils_crypto.Salt(trimmedPassword))

	accountData := dbModels.User{}
	result := db.Where("email = ?", trimmedEmail).Where("password = ?", hashedPassword).First(&accountData)
	if result.Error != nil {
		c.JSON(401, gin.H{"message": "Incorrect credentials", "payload": nil})
		return
	}

	c.JSON(200, gin.H{"message": "Success", "payload": gin.H{"id": accountData.Eid, "email": accountData.Email, "username": accountData.Username, "tag": accountData.Tag, "token": accountData.Token}})
}
