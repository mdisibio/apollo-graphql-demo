//------------------------------------------------------
// Authors rest-ful API
// This is a basic API that is an example of what an 
// existing "legacy" API might look like.
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
    res.send(authors);
});

app.get('/:id', (req: Request, res: Response) => {
    let { id } = req.params;
    res.send(authors.find(a => a.id == id))
});

app.get('/batch/:ids', (req: Request, res: Response) => {
    let ids : Number[] = req.params.ids.split(',')
    res.send(ids.map(id => authors.find(a => a.id == id)));
})

app.listen(8080);
