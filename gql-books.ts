//------------------------------------------------------
// Books GraphQL API
// This is a basic graphQL API that is an example of how
// implement graphQL on top of an existing rest-ful API.
// It is a full app listening on its own port.
//
// This uses node fetch package to construct rest requests.
//------------------------------------------------------

import {ApolloServer, gql } from 'apollo-server'
import { PubSub } from 'graphql-subscriptions'
import fetch from 'node-fetch';

const pubsub = new PubSub();

const typeDefs = gql`
  type Book {
    id: ID!
    title: String
    authorId: ID!
    sold: Int
  }

  type Query {
    books: [Book]
    book(id : Int) : Book
  }

  type Mutation {
    sellBook(id: ID!) : Book
  }

  type Subscription {
    bookSold: Book
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
    Mutation: {
        sellBook: async (obj, args, context, info) => {
          console.log(`gql selling book: ${args.id}`)
          
          var b = await (await fetch(`${api}/${args.id}/sales`, {
            method: 'POST'
          })).json()
          
          pubsub.publish('bookSold', {
            bookSold: b
          });
          
          return b;
        }
    }, 
    Subscription: {
      bookSold: {
        subscribe: () => {
          console.log('New subscription to gql bookSold')
          return pubsub.asyncIterator('bookSold')
        }
      }
    }
};

const server = new ApolloServer({ 
  typeDefs, 
  resolvers, 
  tracing: true, 
  introspection: true, 
  playground: true });

server.listen({port: 8082}).then(({ url }) => {
  console.log(`🚀  Books gql ready at ${url}`);
});

export default server;