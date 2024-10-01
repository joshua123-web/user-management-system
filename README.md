# User Management System

This project is a User Management System developed using Express.js, Node.js, and MongoDB. It allows users to register, log in, view, and update their profile.

## Features Implemented

- **User Registration**: Users can register with their name, email, and password. The password is securely hashed using bcrypt.
- **User Login**: Existing users can log in with their email and password, and receive a JWT token for authentication.
- **View Profile**: Authenticated users can view their profile by providing a valid JWT token.
- **Update Profile**: Authenticated users can update their profile information, such as name and email.

## Setup and Installation

1. Clone this repository.
2. Run `npm install` to install dependencies.
3. Create a `.env` file and add the following:
   ```plaintext
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
