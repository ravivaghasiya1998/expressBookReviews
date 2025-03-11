const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
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
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
