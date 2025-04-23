const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
    if (!isValid(username)) {
      return res.status(400).json({ message: "Username already exists." });
    }
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully." });
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
      return res.status(200).json(book);
    }
    return res.status(404).json({ message: "Book not found." });
  });
  
// Get book details based on author
public_users.get('/author/:author', (req, res) => {
    const authorQuery = req.params.author.toLowerCase();
    const results = Object.entries(books)
      .filter(([, book]) => book.author.toLowerCase() === authorQuery)
      .map(([isbn, book]) => ({ isbn, ...book }));
    if (results.length) {
      return res.status(200).json(results);
    }
    return res.status(404).json({ message: "No books found by that author." });
  });

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
    const titleQuery = req.params.title.toLowerCase();
    const results = Object.entries(books)
      .filter(([, book]) => book.title.toLowerCase() === titleQuery)
      .map(([isbn, book]) => ({ isbn, ...book }));
    if (results.length) {
      return res.status(200).json(results);
    }
    return res.status(404).json({ message: "No books found with that title." });
  });

//  Get book review
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
      return res.status(200).json(book.reviews);
    }
    return res.status(404).json({ message: "Book not found." });
  });

module.exports.general = public_users;
