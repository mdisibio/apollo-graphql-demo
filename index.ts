//------------------------------------------------------
// Authors rest-ful API
// This is a basic API that is an example of what an 
// existing "legacy" API might look like. It is a full
// express app listening on its own port.
//------------------------------------------------------

import {ApolloServer, introspectSchema, makeRemoteExecutableSchema, mergeSchemas } from 'apollo-server'
import { WebSocketLink } from "apollo-link-ws";
import WebSocket from 'ws';
import { GraphQLSchema } from 'graphql';
import { AddBooksAuthor } from './add-books-author';

// Start rest apis
import './api-books';
import './gql-books';

// Start remote graphql
import './api-authors';
import './gql-authors';

async function loadRemoteSchema(uri: string) : Promise<GraphQLSchema> {
    const link = new WebSocketLink({uri, webSocketImpl: WebSocket})
    const schema = await introspectSchema(link);
    const executableSchema = makeRemoteExecutableSchema({
        schema,
        link,
    });
    return executableSchema
}

(async () => {
    // Load remote schemas
    const bookSchema = await loadRemoteSchema('ws://localhost:8082/graphql')
    const authorSchema = await loadRemoteSchema('ws://localhost:8084/graphql')
    var schemas = [
        bookSchema,
        authorSchema
    ];
    
    // Will hold extra resolvers
    var resolvers = {};

    // Extend graphql with new fields and resolvers
    AddBooksAuthor(authorSchema, schemas, resolvers);

    // Schema stitching - Merge all to create final schema
    const schema = mergeSchemas({
        schemas,
        resolvers
    })

    const server = new ApolloServer({ 
        schema, 
        tracing: true, 
        introspection: true, 
        playground: true });
    const { url } = await server.listen();
    console.log(`🚀  Server ready at ${url}`);
})();