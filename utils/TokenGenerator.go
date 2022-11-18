package utils

import (
	"math/rand"
	"time"
)

func GenerateToken() string {
	runes := []rune("qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM")
	newToken := make([]rune, 16)
	for i := range newToken {
		rand.Seed(time.Now().UnixNano())
		newToken[i] = runes[rand.Intn(len(runes))]
	}
	return string(newToken)
}
