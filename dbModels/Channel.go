package dbModels

import "gorm.io/gorm"

type Channel struct {
	gorm.Model
	Id   uint `gorm:"primaryKey"`
	Eid  uint64
	Name string
}
