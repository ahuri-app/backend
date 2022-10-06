package dbModels

import "gorm.io/gorm"

type Channel struct {
	gorm.Model
	Id   uint `gorm:"primaryKey"`
	Name string
	Aid  uint64
}
