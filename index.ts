import {ApolloServer, gql, introspectSchema, makeRemoteExecutableSchema, mergeSchemas } from 'apollo-server'
import { HttpLink } from 'apollo-link-http';
import fetch from 'cross-fetch';

import './api_books';
import './gql_books';

import './api_authors';
import './gql_authors';

async function loadRemoteSchema(uri: string) {
    const link = new HttpLink({ uri , fetch });
    const schema = await introspectSchema(link);
    const executableSchema = makeRemoteExecutableSchema({
        schema,
        link,
    });
    return executableSchema
}

(async () => {
    const bookSchema = await loadRemoteSchema('http://localhost:8082')
    const authorSchema = await loadRemoteSchema('http://localhost:8084')

    const schema = mergeSchemas({
        schemas: [
            bookSchema,
            authorSchema
        ]
    })

    const server = new ApolloServer({ schema });
    const { url } = await server.listen();
    console.log(`🚀  Server ready at ${url}`);
})();