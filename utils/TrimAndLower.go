package utils

import "strings"

func TrimAndLower(input string) string {
	return strings.ToLower(strings.TrimRight(strings.TrimLeft(input, " "), " "))
}
