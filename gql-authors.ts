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
  type Author {
      id: ID!
      name: String
  }

  type Query {
    authors: [Author]
    author(id : Int) : Author
  }
`;

const api = "http://localhost:8083";

const resolvers = {
  Query: {
    authors: async () => {
      console.log('gql fetching all authors')
      var books = await fetch(`${api}/`);
      return books.json();
    },
    author: async (obj, args, context, info) => { 
      console.log(`gql fetching author id ${args.id}`); 
      var b = await fetch(`${api}/${args.id}`);
      return b.json();
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers, tracing: true });

server.listen({port: 8084}).then(({ url }) => {
  console.log(`🚀  Authors gql ready at ${url}`);
});

export default server;