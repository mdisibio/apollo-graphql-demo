//------------------------------------------------------
// Books GraphQL API
// This is a basic graphQL API that is an example of how
// to implement graphQL on top of an existing restful API.
//------------------------------------------------------

import {ApolloServer, gql } from 'apollo-server'
import fetch from 'node-fetch';

const typeDefs = gql`
  type Author {
      id: ID!
      name: String
  }

  type Query {
    authors: [Author]
    authorsByID(ids : [Int]) : [Author]
    author(id : Int) : Author
  }
`;

const api = "http://authors-api:8080";

const resolvers = {
  Query: {
    authors: async () => {
      var r = await fetch(`${api}/`);
      return r.json();
    },

    authorsByID: async (obj, args, context, info) => {
      var r = await fetch(`${api}/batch/${args.ids.join(',')}`);
      return r.json();
    },

    author: async (obj, args, context, info) => { 
      var r = await fetch(`${api}/${args.id}`);
      return r.json();
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
