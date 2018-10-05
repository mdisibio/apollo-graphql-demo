import {ApolloServer, introspectSchema, makeRemoteExecutableSchema, mergeSchemas } from 'apollo-server'
import { HttpLink } from 'apollo-link-http';
import fetch from 'cross-fetch';
import { GraphQLSchema } from 'graphql';
import { AddBooksAuthor } from './add-books-author';

import './api_books';
import './gql_books';

import './api_authors';
import './gql_authors';

async function loadRemoteSchema(uri: string) : Promise<GraphQLSchema> {
    const link = new HttpLink({ uri , fetch });
    const schema = await introspectSchema(link);
    const executableSchema = makeRemoteExecutableSchema({
        schema,
        link,
    });
    return executableSchema
}

(async () => {
    // Load remote schemas
    const bookSchema = await loadRemoteSchema('http://localhost:8082')
    const authorSchema = await loadRemoteSchema('http://localhost:8084')
    var schemas = [
        bookSchema,
        authorSchema
    ];
    
    // Will hold extra resolvers
    var resolvers = {};

    // Load extra graphql fields and resolvers
    AddBooksAuthor(authorSchema, schemas, resolvers);

    // Merge all to create final
    const schema = mergeSchemas({
        schemas,
        resolvers
    })

    const server = new ApolloServer({ schema });
    const { url } = await server.listen();
    console.log(`🚀  Server ready at ${url}`);
})();