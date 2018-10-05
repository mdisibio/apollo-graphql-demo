//------------------------------------------------------
// Authors rest-ful API
// This is a basic API that is an example of what an 
// existing "legacy" API might look like. It is a full
// express app listening on its own port.
//------------------------------------------------------

import { Request, Response } from 'express';
import express = require('express')

let app = express();

// The data. In a real-world example this would
// be stored in a database or other.
const authors = [
    {
        id: 0,
        name: 'J.K. Rowling'
    },
    {
        id: 1,
        name: 'Michael Crichton'
    }
]

app.get('/', (req: Request, res: Response) => {
    console.log("rest fetching all authors")
    res.send(authors);
});

app.get('/:id', (req: Request, res: Response) => {
    let { id } = req.params;
    console.log(`rest fetching author id ${id}`)
    res.send(authors.find(b => b.id == id))
});

app.listen(8083, () => {
    console.log("🚀  Authors api ready at http://localhost:8083/")
});

export default app;
