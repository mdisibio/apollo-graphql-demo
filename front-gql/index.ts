//------------------------------------------------------
// Front-end GraphSQL Server
// This service runs on top of the individual GraphSQL
// services.  It proxies access to them, and also adds
// cross-schema operations.
//------------------------------------------------------

import {ApolloServer, introspectSchema, makeRemoteExecutableSchema, mergeSchemas } from 'apollo-server'
import { WebSocketLink } from "apollo-link-ws";
import WebSocket from 'ws';
import { GraphQLSchema } from 'graphql';
import { AddBooksAuthor } from './add-books-author';

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
    const bookSchema = await loadRemoteSchema('ws://books-gql:8080/graphql')
    const authorSchema = await loadRemoteSchema('ws://authors-gql:8080/graphql')
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
    console.log(`🚀 Graphql server ready at ${url}`);
})();