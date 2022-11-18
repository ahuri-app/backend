package utils

import "strings"

func Trim(input string) string {
	return strings.TrimRight(strings.TrimLeft(input, " "), " ")
}
