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
      return res.status(200).json({"createdUser": newUser})
  }
})

const fetchBooks = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 200); // Simulating delay
  });
};


// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    const retBooks = await fetchBooks()
    res.status(200).send(JSON.stringify(retBooks, null, 4))
  } catch (err) {
    console.error(`Error fetching books: ${err}`)
    res.status(500).json({message: 'Error fetching books'})
  }
});

const fetchBookIsbn = (isbn) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = books[isbn] ? books[isbn] : {message: `no book found on database for isbn ${isbn}`}
      resolve(book);
    }, 200); // Simulating delay
  });
};

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = parseInt(req.params.isbn)  

  try {
    const book = await fetchBookIsbn(isbn)

  res.status(200).send(JSON.stringify(book))
  } catch (err) {
    console.error(`Error fetching book: ${err}`)
    res.status(500).json({message: 'Error fetching book by isbn'})
  }
 });

const fetchBookAuthor = (author) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let filteredBooks = {}
  
      for (const book in books) {
        if (books[book].author === author) {
          filteredBooks[book] = books[book]
        }
      }

      resolve(filteredBooks)
    }, 200); // Simulating delay
  });
};

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author

  try {
    const filteredBooks = await fetchBookAuthor(author)
    res.status(200).send(JSON.stringify(filteredBooks))
  } catch (err) {
    console.error(`Error fetching book: ${err}`)
    res.status(500).json({message: 'Error fetching book by author'})
  }
});

const fetchBookTitle = (title) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let filteredBooks = {}
  
      for (const book in books) {
        if (books[book].title === title) {
          filteredBooks[book] = books[book]
        }
      }

      resolve(filteredBooks)
    }, 200) // Simulating delay
  });
}

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title

  try {
    const filteredBooks = await fetchBookTitle(title)
    res.status(200).send(JSON.stringify(filteredBooks))
  } catch (err) {
    console.error(`Error fetching book: ${err}`)
    res.status(500).json({message: 'Error fetching book by title'})
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  
  const book = books[isbn] ? books[isbn] : {message: `no book found on database for isbn ${isbn}`}

  const reviews = book["reviews"]

  res.status(200).send(JSON.stringify({reviews}))
});

module.exports.general = public_users;
