package utils

import (
	"math/rand"
	"strconv"
	"time"
)

func GenerateEid() uint64 {
	runes := []rune("0123456789") // hex chars
	newAid := make([]rune, 16)
	for i := range newAid {
		rand.Seed(time.Now().UnixNano())
		newAid[i] = runes[rand.Intn(len(runes))]
	}
	retValue, _ := strconv.ParseUint(string(newAid), 10, 64)
	return retValue
}
