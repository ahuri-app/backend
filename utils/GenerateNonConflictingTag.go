package utils

import "backend/dbModels"

func GenerateNonConflictingTag(username string) string {
	db, _ := Db()
	generatedTag := GenerateTag()
	if db.Where("username = ?", username).Where("tag = ?", generatedTag).First(&dbModels.User{}).Error == nil {
		return GenerateNonConflictingTag(username)
	}
	return generatedTag
}
