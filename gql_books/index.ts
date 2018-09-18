import {ApolloServer, gql } from 'apollo-server'
import fetch from 'node-fetch';

const typeDefs = gql`
  type Book {
    id: ID!
    title: String
    authorIds: [Int]
  }

  type Query {
    books: [Book]
    book(id : Int) : Book
  }
`;

const api = "http://localhost:8081";

const resolvers = {
    Query: {
      books: async () => {
          console.log('gql fetching all books')
          var books = await fetch(`${api}/`);
          return books.json();
      },
      book: async (obj : any, args : any, context : any, info : any) => { 
          console.log(`gql fetching book id ${args.id}`); 
          var b = await fetch(`${api}/${args.id}`);
          return b.json();
        }
    },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({port: 8082}).then(({ url }) => {
  console.log(`🚀  Books gql ready at ${url}`);
});

export default server;