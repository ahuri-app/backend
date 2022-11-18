package middleware

import "github.com/gin-gonic/gin"

func Cors(c *gin.Context) {
	if c.Request.Method != "OPTIONS" {
		c.Next()
	} else {
		c.Header("Access-Control-Allow-Origin", "*")
		c.AbortWithStatus(200)
	}
}
