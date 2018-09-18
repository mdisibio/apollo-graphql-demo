import {ApolloServer, gql } from 'apollo-server'

import './api_books';
import './gql_books';

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

const typeDefs = gql`
  type Author {
      id: ID!
      name: String
  }

  type Book {
    id: ID!
    title: String
    authorIds: [Int]
    authors: [Author]
  }

  type Query {
    authors: [Author]
    author(id : Int) : Author
    books: [Book]
    book(id : Int) : Book
  }
`;

const resolvers = {
    Query: {
      authors: () => authors,
      author: (obj : any, args : any, context : any, info : any) => { 
          console.log(`Fetching author id ${args.id}`); 
          return authors.find(a => a.id == args.id); 
        },
      books: () => {
          console.log('Fetching all books')
          //return books
      },
      book: (obj : any, args : any, context : any, info : any) => { 
          console.log(`Fetching book id ${args.id}`); 
          //return books.find(b => b.id == args.id);
        }
    },
    Book: {
        authors: (obj : any, args : any, ctx : any, info : any) => {
            console.log(`Fetching authors ${obj.authorIds}`)
            return authors.filter(a => obj.authorIds.includes(a.id) );
        }
    }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});