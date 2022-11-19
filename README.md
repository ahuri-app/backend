# ahuri-app/backend
This repository is for our backend/API

# Stack:
 - Node.js
 - TypeScript
 - Prisma
 - SQLite
 - Express

# .env
Note: DO NOT change salt value between runs or the passwords in the database will all break

### Production .env values
Use these values for running in a production environment:
```
PORT=81
DATABASE_FILE_PATH="file:./prod.db"
SALT="spam your keyboard for the salt"
```

### Development .env values
Use these values for running in a development environment:
```
PORT=8080
DATABASE_FILE_PATH="file:./dev.db"
SALT="testing testing 123"
```

# Deployment

Server must have:
 - Node.js
 - NPM
 - Git

To deploy into production, set up a working .env then run these commands:
```
git clone https://github.com/ahuri-app/backend.git
cd backend
npm i
npm run build
npm run db:push
npm run prod
```