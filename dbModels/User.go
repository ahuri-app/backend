package dbModels

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Id       uint `gorm:"primaryKey"`
	Eid      uint64
	Username string
	Tag      string
	Email    string
	Password string
	Token    string
}
