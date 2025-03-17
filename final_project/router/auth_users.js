const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Function to check if a username is valid (not already taken)
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Function to check if username and password match the records
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if user exists and password is correct
  if (!authenticatedUser(username, password)) {
      return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate JWT token
  const accessToken = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });

  return res.status(200).json({
      message: "Login successful",
      token: accessToken
  });
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "Token required" });

  jwt.verify(token, "secret_key", (err, user) => {
      if (err) return res.status(401).json({ message: "Invalid Token" });

      req.user = user; // Store user info in request
      next();
  });
};

// Add or modify a book review
regd_users.put("/auth/review/:isbn", verifyToken, (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const username = req.user.username;

  if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
  }

  if (!review) {
      return res.status(400).json({ message: "Review cannot be empty" });
  }

  // If book has reviews, update the existing one or add new
  if (!books[isbn].reviews) {
      books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review; // Add/Update review

  return res.status(200).json({ message: "Review added/updated successfully", reviews: books[isbn].reviews });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", verifyToken, (req, res) => {
  const { isbn } = req.params;
  const username = req.user.username;

  if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews || !books[isbn].reviews[username]) {
      return res.status(404).json({ message: "No review found for this user" });
  }

  // Delete the user's review
  delete books[isbn].reviews[username];

  return res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
