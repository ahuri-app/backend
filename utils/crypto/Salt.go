package utils_crypto

import "os"

func Salt(valueToSalt string) string {
	return valueToSalt + os.Getenv("SALT")
}
