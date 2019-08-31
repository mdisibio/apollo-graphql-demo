//------------------------------------------------------
// Books rest-ful API
// This is a basic API that is an example of what an 
// existing "legacy" API might look like. It has apis
// to read and write books.
//------------------------------------------------------

import { Request, Response } from 'express';
import express = require('express')

let app = express();

// The data. In a real-world example this would
// be stored in a database or other.
const books = [
    {
      id: 0,
      title: 'Harry Potter and the Chamber of Secrets',
      authorId: 0,
      sold: 0
    },
    {
        id: 1,
        title: 'Harry Potter and the Goblet of Fire',
        authorId: 0,
        sold: 0
    },
    {
      id: 2,
      title: 'Jurassic Park',
      authorId: 1,
      sold: 0
    },
  ];

app.get('/', (req: Request, res: Response) => {
    res.send(books);
});

app.get('/:id', (req: Request, res: Response) => {
    let id = parseInt(req.params.id);
    res.send(books.find(b => b.id == id))
});

app.post('/:id/sales', (req: Request, res: Response) => {
    let id = parseInt(req.params.id); 
    var book = books.find(b => b.id == id);
    if(book) {
        book.sold = book.sold + 1;
    }
    res.send(book);
});

app.listen(8080);
