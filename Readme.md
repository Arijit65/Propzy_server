# 📘 Backend (Server) README

This backend is built with **Node.js + Express + PostgreSQL**, using **Sequelize** as the ORM. It powers a social media-type platform with user accounts, posts, likes, comments, and profiles.

---

## 🛠️ Tech Stack

- **Node.js**: Server runtime
- **Express.js**: Web framework
- **PostgreSQL**: Database
- **Sequelize**: ORM to interact with Postgres
- **Multer**: File upload middleware
- **JWT**: Authentication using JSON Web Tokens
- **bcrypt**: Password hashing

---

## 📂 Folder Structure

```
server/
├── config/              # DB config (uses dotenv)
├── controllers/         # Business logic (User, Post, etc)
├── middlewares/         # Auth & file upload
├── migrations/          # Sequelize migration files
├── models/              # Sequelize models
├── routes/              # Express route files
├── uploads/             # Image upload folder
├── .env                 # Environment variables
└── index.js             # Main entry point
```

---

## 🔌 Setting up the Project

### 1. Install dependencies

```
npm install
```

### 2. Create `.env` file

```
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASS=your_db_password
DB_HOST=localhost
DB_DIALECT=postgres
JWT_SECRET=your_jwt_secret
```

### 3. Initialize Sequelize (if not done)

```
npx sequelize-cli init
```

### 4. Run Migrations

```
npx sequelize-cli db:migrate
```

### 5. Start the server

```
npm run dev
```

---

## 🔑 Authentication

- **JWT** is used for authentication.
- After logging in, the client will receive a `token`.
- The token must be sent in the `Authorization` header:

```
Authorization: Bearer <your-token>
```

- A middleware (`authMiddleware.js`) decodes this token and adds `req.user`.

---

## 👤 User Features

### Register

`POST /api/users/register`

```json
{
  "email": "test@example.com",
  "password": "secret",
  "role": "consumer",
  "mobileNumber": "1234567890"
}
```

### Login

`POST /api/users/login`

```json
{
  "email": "test@example.com",
  "password": "secret"
}
```

### Profile Update

`PUT /api/users/profile` (requires token)

```json
{
  "name": "Alice",
  "bio": "I love coding",
  "avatar": "avatar.jpg",
  "location": "India",
  "dob": "1999-10-10"
}
```

---

## 📝 Posts, Likes, Comments

### Create Post

`POST /api/posts/create` (requires token)

```json
{
  "content": "My first post",
  "mediaUrl": "image.jpg",
  "isPublic": true
}
```

### Like a Post

`POST /api/posts/like` (requires token)

```json
{
  "postId": 1
}
```

### Comment on a Post

`POST /api/posts/comment` (requires token)

```json
{
  "postId": 1,
  "text": "Nice one!"
}
```

---

## 🧱 Sequelize Models Overview

### User

- email, password, role (consumer/business), mobileNumber, isBusinessUpgraded

### Profile

- userId (FK), name, bio, avatar, location, phone, dob

### Post

- userId (FK), content, mediaUrl, isPublic (boolean)

### Like

- userId (FK), postId (FK)

### Comment

- userId (FK), postId (FK), text

### Connection (Follow system)

- followerId (FK), followingId (FK)

---

## 📤 Uploads

- File uploads use `multer`
- Profile pics or post media should be sent as `multipart/form-data`
- Endpoint example:

```js
router.post("/upload", upload.single("avatar"), (req, res) => {
  res.json({ filename: req.file.filename });
});
```

Make sure to serve uploads folder in `index.js`:

```js
app.use("/uploads", express.static("uploads"));
```

---

## ✅ Tips for Readers

- Controllers handle the logic.
- Models define what the data looks like.
- Migrations actually create the tables.
- Use Postman or ThunderClient to test your endpoints.
- Always send JWT token when calling protected routes.

---

Need help? Ask your lead or check out Sequelize docs: [https://sequelize.org](https://sequelize.org)

