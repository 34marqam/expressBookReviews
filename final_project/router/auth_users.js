const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {username: 'test', password: 'test123'},
    {username: 'test2', password: 'test2'}
];

const isValid = (username)=>{ //returns boolean
//write code to check if the username is valid
    let validuser = users.filter(user => user.username === username);
    return validuser > 0 ? true : false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validlogin = users.filter(user => {
        return (user.username===username && user.password===password);
    });
    return validlogin.length > 0 ? true : false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password) return res.status(404).json({message: "Error logging in"});

  if (authenticatedUser(username, password)){
      let accessToken = jwt.sign(
          {data: password},
          'access',
          { expiresIn: 60 * 60 }
      );
      req.session.authorization = {accessToken, username};
      return res.status(200).send("User successfully logged in");
  }
  return res.status(208).json({message: "Invalid Login. Check username and password"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const user = req.session.authorization.username;
  const review = req.query.review;
  const isbn = req.params.isbn;

  if(!review)
    return res.status(404).json({message: "Unable to add review!"});
  if(!(isbn in books))
    return res.status(404).json({message: "Book not found!"});

//   return res.send(books[isbn][reviews])
    books[isbn]['reviews'][user] = review;
  return res.status(200).json({message: `Review for book with isbn ${isbn} has been added/ updated!`});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const user = req.session.authorization.username;
    const isbn = req.params.isbn;

    if(!(isbn in books))
        return res.status(404).json({message: "Book not found!"});

    delete books[isbn]['reviews'][user];
    return res.status(200).json({message: `Review for the isbn ${isbn} for user ${user} has been deleted!`});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
