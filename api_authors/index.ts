import { Router, Request, Response } from 'express';
import express = require('express')

let app = express();

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
