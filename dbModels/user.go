package dbModels

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Id       uint `gorm:"primaryKey"`
	Username string
	Email    string
	Password string
	Aid      uint64
	Token    string
}
