const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    const filtered = users.filter((user) => {
        return user.username === username
    })

    return Boolean(filtered.length) //if zero (falsy), will return false
}


const authenticatedUser = (username, password) => { //returns boolean
    const validUser = users.filter((user) => {
        return (user.username === username && user.password === password)
    })

    return Boolean(validUser.length) //if zero (falsy), will return false
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username
  const password = req.body.password

  if (!username || !password) {
      return res.status(404).json({message: "Unable to login user (missing parameters"})
  } else if (!authenticatedUser(username, password)) {
      return res.status(404).json({message: "Invalid login. Check username and password"})
  } else {
      // 'access' stands in for a secret key
      const accessToken = jwt.sign({
          data: password
      }, 'access', {expiresIn: 60 * 60})

      // console.log(req.session)

      // this is server-side token management, I think
      req.session.authorization = {
          accessToken,
          username
      }

      // console.log(req.session)

      return res.status(200).json({message: `User ${username} succesfully logged in`})
  }
})

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
