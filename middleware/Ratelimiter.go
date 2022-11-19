package middleware

import (
	ratelimit "github.com/JGLTechnologies/gin-rate-limit"
	"github.com/gin-gonic/gin"

	"time"
)

func keyFunc(c *gin.Context) string {
	return c.ClientIP()
}

func errorHandler(c *gin.Context, info ratelimit.Info) {
	c.String(429, "Too many requests. Try again in "+time.Until(info.ResetTime).String())
}

var Ratelimiter gin.HandlerFunc = ratelimit.RateLimiter(
	ratelimit.InMemoryStore(
		&ratelimit.InMemoryOptions{
			Rate:  time.Minute,
			Limit: 500,
		},
	),
	&ratelimit.Options{
		KeyFunc:      keyFunc,
		ErrorHandler: errorHandler,
	},
)
