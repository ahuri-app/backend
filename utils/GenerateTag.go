package utils

import (
	"math/rand"
	"time"
)

func GenerateTag() string {
	runes := []rune("qwertyuiopasdfghjklzxcvbnm")
	newTag := make([]rune, 4)
	for i := range newTag {
		rand.Seed(time.Now().UnixNano())
		newTag[i] = runes[rand.Intn(len(runes))]
	}
	return string(newTag)
}
