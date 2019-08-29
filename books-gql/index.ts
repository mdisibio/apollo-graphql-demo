//------------------------------------------------------
// Books GraphQL API
// This is a basic graphQL API that is an example of how
// to implement graphQL on top of an existing restful API.
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

const api = "http://books-api:8080";

const resolvers = {
    Query: {
      books: async () => {
          return (await fetch(`${api}/`)).json();
      },
      book: async (obj, args, context, info) => { 
          return (await fetch(`${api}/${args.id}`)).json();
        }
    },
    Mutation: {
        sellBook: async (obj, args, context, info) => {
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

server.listen({port: 8080});
