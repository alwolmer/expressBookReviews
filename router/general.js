const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username
  const password = req.body.password

  if (!username || !password) {
      return res.status(404).json({message: "Unable to register user (missing parameters)"})
  } else if (isValid(username)) {
      return res.status(404).json({message: "User with username already exists"})
  } else {
      const newUser = {
          "username": username,
          "password": password
      }
      users.push(newUser)
      return res.status(200).json(newUser)
  }
})

// Get the book list available in the shop
public_users.get('/',function (req, res) {

  res.status(200).send(JSON.stringify(books, null, 4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = parseInt(req.params.isbn)  

  const book = books[isbn] ? books[isbn] : {message: `no book found on database for isbn ${isbn}`}

  res.status(200).send(JSON.stringify(book))
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author

  let filteredBooks = {}
  
  for (const book in books) {
    if (books[book].author === author) {
      filteredBooks[book] = books[book]
    }
  }

  res.status(200).send(JSON.stringify(filteredBooks))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title

  let filteredBooks = {}
  
  for (const book in books) {
    if (books[book].title === title) {
      filteredBooks[book] = books[book]
    }
  }

  res.status(200).send(JSON.stringify(filteredBooks))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  
  const book = books[isbn] ? books[isbn] : {message: `no book found on database for isbn ${isbn}`}

  const reviews = book["reviews"]

  res.status(200).send(JSON.stringify(reviews))
});

module.exports.general = public_users;
