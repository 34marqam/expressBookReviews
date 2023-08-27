const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if(username && password){
    if(!isValid(username)){
        users.push({'username':username, 'password':password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
    }
    else
        return res.status(404).json({message: "User already exist!"});
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let book = {'books': books}
  return res.send(JSON.stringify(book, null, 4));
});

// task 10
public_users.get('/books', async (req, res) => {
    await new Promise( resolve => {
        resolve(res.send(JSON.stringify(books, null, 4)));
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (isbn in books)
    return res.send(books[isbn]);
  else
    return res.status(404).json({message: "Book not found!"});
 });

 // task 11
 public_users.get('/async_isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    await new Promise( (resolve) => {
        if(isbn in books)
            resolve(res.send(books[isbn]));
        else
            resolve(res.status(404).json({message: "Book not found!"}));
    });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let book = {};
  const author = req.params.author;
  for(const key in books)
    if(books[key]["author"] === author)
        book[key] = books[key];
  if(Object.keys(book).length)
    return res.send(book);
  return res.status(404).json({message: "Book not found!!"});
});

// task 12
public_users.get('/async_author/:author',async (req, res) => {
    //Write your code here
    let book = {};
    const author = req.params.author;

    for(const key in books)
      if(books[key]["author"] === author)
          book[key] = books[key];
    
    await new Promise(resolve => {
        if(Object.keys(book).length)
            resolve(res.send(book));
        else
            resolve(res.status(404).json({message: "Book not found!!"}));
    });
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
//   let bookbytitle = {};
  for(const key in books)
    if(books[key]["title"] === title){
        let bookbytitle = {
            'isbn': key,
            'title': books[key]['title'],
            'reviews': books[key]['reviews']
        }
        return res.send(bookbytitle);
    }
  return res.status(404).json({message: "Book not found!!"});
});

// task 13
public_users.get('/async_title/:title',async (req, res) => {
    const title = req.params.title;
    let bookbytitle = {};
    for(const key in books)
        if(books[key]["title"] === title){
            bookbytitle = {
                'isbn': key,
                'title': books[key]['title'],
                'reviews': books[key]['reviews']
            }
        }
    await new Promise(resolve =>{
        if('isbn' in bookbytitle)
            resolve(res.send(bookbytitle));
        else
            resolve(res.status(404).json({message: "Book not found!!"}));
    });
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if(isbn in books){
    let review = {
        'isbn' : isbn,
        'reviews' : books[isbn]["reviews"]
    };
    res.send(review);
  }
  return res.status(404).json({message: "Book not found!"});
});

module.exports.general = public_users;
