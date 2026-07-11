# Social network - Backend

## Overview
RESTful API powering a Social network platform.

## Architecture

```
Route → Controller → Service → MySQL
```
## Features
- JWT Authentication
- Email Verification
- Post Management
- User Management

## Technologies

- Node.js
- Express.js
- MySQL
- Sequelize
- JWT
- Nodemailer
- Sufy Cloud Storage

## Environment Variables

Create a `.env` file in the project root and configure the following variables.

### Sufy Cloud

This project uses Sufy Cloud for image storage.

1. Create a Sufy Cloud account.
2. Create a storage bucket.
3. Copy your credentials from the Sufy Cloud dashboard.

```env
ACCESSKEYID =
SECRETACCESSKEY = 
```
### Application Configuration

```env
PORT=8089

EMAIL_PASSWORD =

MONGODB_URL=

PASSMYSQL=

DB_NAME=

DB_USER=

HOST=

PORTDB=

ACCESS_TOKEN=

REFRESH_TOKEN=
```

## Running the Project

```bash
npm install
npm start
```

## Related Repository

Frontend Repository:
https://github.com/Phucttgiakiem/Social_network.git









