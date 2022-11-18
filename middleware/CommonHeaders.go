package middleware

import "github.com/gin-gonic/gin"

func CommonHeaders(c *gin.Context) {
	c.Header("Content-Type", "application/json")
	c.Next()
}
