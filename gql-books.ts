//------------------------------------------------------
// Books GraphQL API
// This is a basic graphQL API that is an example of how
// implement graphQL on top of an existing rest-ful API.
// It is a full app listening on its own port.
//
// This uses node fetch package to construct rest requests.
//------------------------------------------------------

import {ApolloServer, gql } from 'apollo-server'
import fetch from 'node-fetch';

const typeDefs = gql`
  type Book {
    id: ID!
    title: String
    authorId: ID!
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
      book: async (obj, args, context, info) => { 
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