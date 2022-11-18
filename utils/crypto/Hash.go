package utils_crypto

import (
	"crypto/sha512"
	"encoding/hex"
)

func Hash(valueToHash string) string {
	hashedValueBytes := sha512.Sum512([]byte(valueToHash))
	return hex.EncodeToString(hashedValueBytes[:])
}
