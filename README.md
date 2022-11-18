# Environment variables  
DB_PATH: file path to database (if file doesnt exist it creates database file)  
PORT: server port  
SALT: password salt (do not change between runs or passwords break in database)

### Production values for env vars
DB_PATH="./prod.db"
PORT=any port (for example 8080)
SALT="spam your keyboard for it"