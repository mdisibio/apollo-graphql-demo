//------------------------------------------------------
// Books rest-ful API
// This is a basic API that is an example of what an 
// existing "legacy" API might look like. It is a full
// express app listening on its own port.
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
    },
    {
        id: 1,
        title: 'Harry Potter and the Goblet of Fire',
        authorId: 0
    },
    {
      id: 2,
      title: 'Jurassic Park',
      authorId: 1,
    },
  ];

app.get('/', (req: Request, res: Response) => {
    console.log("rest fetching all books")
    res.send(books);
});

app.get('/:id', (req: Request, res: Response) => {
    let { id } = req.params;
    console.log(`rest fetching book id ${id}`)
    res.send(books.find(b => b.id == id))
});

app.listen(8081, () => {
    console.log("🚀  Books api ready at http://localhost:8081")
});

export default app;
