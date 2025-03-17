const express = require('express');
let books = require("./books.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register a new user
public_users.post('/register', function (req, res) {
  const { username, password } = req.body;

  // Check if both username and password are provided
  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  if (users[username]) {
      return res.status(409).json({ message: "Username already exists" });
  }

  // Store the new user
  users[username] = { password };
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4))

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let book_isbn = req.params.isbn ;
  res.send(books[book_isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let authorName = req.params.author;
  let matchingBooks = [];

  // Iterate over the books object and find books by the given author
  Object.keys(books).forEach(isbn => {
      if (books[isbn].author.toLowerCase() === authorName.toLowerCase()) {
          matchingBooks.push(books[isbn]); 
      }
  });

  if (matchingBooks.length > 0) {
      res.status(200).json(matchingBooks); // Return matching books
  } else {
      res.status(404).json({ message: "No books found for this author" }); // Handle no matches
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let titleName = req.params.title;
  let matchingBooks = [];

  // Iterate over the books object and find books by the given title
  Object.keys(books).forEach(isbn => {
    if (books[isbn].title.toLowerCase().includes(titleName.toLowerCase())) {
      matchingBooks.push(books[isbn]); 
    } 
  });
    if (matchingBooks.length > 0) {
      res.status(200).json(matchingBooks); // Return matching books
    } else {
    res.status(404).json({ message: "No books found for this title" }); // Handle no matches
    }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  let isbn = req.params.isbn;

  if (books[isbn]) {
    res.status(200).json({ reviews: books[isbn].reviews });
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Using Async/Await
public_users.get('/books', async (req, res) => {
  try {
      const response = await axios.get('http://localhost:5000/books');  // Mock API URL
      res.status(200).json(response.data);
  } catch (error) {
      res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Using Async/Await
public_users.get('/isbn/:isbn', async (req, res) => {
  let book_isbn = req.params.isbn;
  try {
      const response = await axios.get(`http://localhost:5000/books/${book_isbn}`);  // Mock API URL
      res.status(200).json(response.data);
  } catch (error) {
      res.status(404).json({ message: "Book not found", error: error.message });
  }
});

// Using Async/Await
public_users.get('/author/:author', async (req, res) => {
  let authorName = req.params.author.toLowerCase();
  try {
      const response = await axios.get(`http://localhost:5000/books`); // Mock API URL
      const matchingBooks = Object.values(response.data).filter(book => book.author.toLowerCase() === authorName);

      if (matchingBooks.length > 0) {
          res.status(200).json(matchingBooks);
      } else {
          res.status(404).json({ message: "No books found for this author" });
      }
  } catch (error) {
      res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});


// Using Async/Await
public_users.get('/title/:title', async (req, res) => {
  let titleName = req.params.title.toLowerCase();
  try {
      const response = await axios.get(`http://localhost:5000/books`); // Mock API URL (Replace with actual API URL)
      const matchingBooks = Object.values(response.data).filter(book => book.title.toLowerCase().includes(titleName));

      if (matchingBooks.length > 0) {
          res.status(200).json(matchingBooks);
      } else {
          res.status(404).json({ message: "No books found for this title" });
      }
  } catch (error) {
      res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

module.exports.general = public_users;
