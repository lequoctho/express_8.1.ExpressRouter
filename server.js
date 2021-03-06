// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();

const shortid = require("shortid");

app.set('view engine','pug');
app.set('views','./views');

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

// book
const adapter = new FileSync('db.json');
const db = low(adapter);

// https://expressjs.com/en/starter/basic-routing.html
app.get("/books", (req, res) => {
  res.render('index',{
    books: db.get('books').value()
  });
});

app.get("/books/:id/delete", (req, res)=> {
  var id = req.params.id;
  var book = db.get('books').find({id: id}).value();
  db.get('books').remove(book).write();
  res.redirect("/books");
});

app.get("/books/update/:id", (req, res) => {
  var id = req.params.id;
  var book = db.get('books').find({id: id}).value();
  res.render('update',{
    book: book
  });
});

app.post("/books/:id/update", (req, res)=> {
  var id = req.params.id;
  var text = req.body;
  console.log(text);
  db.get('books').find({id: id}).assign(text).write();
  db.get('posts').find({ title: 'low!' }).assign({ title: 'hi!'}).write()
  res.redirect("/books");
});

app.post("/books/create", (req, res) => {
  req.body.id = shortid.generate();
  db.get('books').push(req.body).write();
  res.redirect("/books");
});

// user
const adapterUser = new FileSync('dbUser.json');
const dbUser = low(adapterUser);

// Set some defaults
dbUser.defaults({users: []}).write();

// https://expressjs.com/en/starter/basic-routing.html
app.get("/users", (req, res) => {
  res.render('indexUsers',{
    users: dbUser.get('users').value()
  });
});

app.get("/users/:id/delete", (req, res)=> {
  var id = req.params.id;
  var book = dbUser.get('users').find({id: id}).value();
  dbUser.get('users').remove(book).write();
  res.redirect("/users");
});

app.get("/users/update/:id", (req, res) => {
  var id = req.params.id;
  var book = dbUser.get('users').find({id: id}).value();
  res.render('update',{
    book: book
  });
});

app.post("/users/:id/update", (req, res)=> {
  var id = req.params.id;
  var text = req.body;
  console.log(text);
  dbUser.get('users').find({id: id}).assign(text).write();
  dbUser.get('posts').find({ title: 'low!' }).assign({ title: 'hi!'}).write()
  res.redirect("/users");
});

app.post("/users/create", (req, res) => {
  req.body.id = shortid.generate();
  dbUser.get('users').push(req.body).write();
  res.redirect("/users");
});

// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
