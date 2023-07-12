const express = require("express");
const app = express();
const port = 4000;
// const books = require("./books");
const { query } = require('./database');
require("dotenv").config();

app.use((req, res, next) => {
    res.on("finish", () => {
      // the 'finish' event will be emitted when the response is handed over to the OS
      console.log(`Request: ${req.method} ${req.originalUrl} ${res.statusCode}`);
    });
    next();
  });
  app.use(express.json());

 


app.post("/books", async (req, res) => {
    
    const { title } = req.body;
    
    try {
          const newBook = await query(
                "INSERT INTO book_inventory (title) VALUES ($1) RETURNING *",
                [title]
              );
            
              res.status(201).json(newBook.rows[0]);
        } 
    catch (err) {
                  console.error(err); 
                  res.status(500).json({message: 'Bad stuff happening'})
                }
    });

 app.get("/books", async (req, res) => {
    // console.log("hello");
    try {
      const allBooks = await query("SELECT * FROM book_inventory");
        
      res.json(allBooks.rows);
    //   res.status(200).json(allBooks.rows);
    } catch (err) {
      console.error(err);
    }
  });

  app.get("/books/:id", async (req, res) => {
    const bookId = parseInt(req.params.id, 10);
  
    try {
      const book = await query("SELECT * FROM book_inventory WHERE id = $1", [bookId]);
  
      if (book.rows.length > 0) {
        res.status(200).json(book.rows[0]);
      } else {
        res.status(404).send({ message: "book not found" });
      }
    } catch (err) {
      console.error(err);
    }
  });

  app.patch("/books/:id", async (req, res) => {
    const bookId = parseInt(req.params.id, 10);
  
    const fieldNames = [
      "title"
    ].filter((name) => req.body[name]);

    console.log(req.body);

    if (fieldNames.length === 0) {
        res.status(400).send({ message: "No fields to update provided" });
        return;
      }
  
    let updatedValues = fieldNames.map(name => req.body[name]);
    const setValuesSQL = fieldNames.map((name, i) => {
      return `${name} = $${i + 1}`
    }).join(', ');
  
    try {
      const updatedbook = await query(
        `UPDATE book_inventory SET ${setValuesSQL} WHERE id = $${fieldNames.length+1} RETURNING *`,
        [...updatedValues, bookId]
      );
  
      if (updatedbook.rows.length > 0) {
        res.status(200).json(updatedbook.rows[0]);
      } else {
        res.status(404).send({ message: "book not found" });
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
      console.error(err);
    }
  });

 app.listen(port, ()=>{
    console.log(`running on ${port}`)
 });
  