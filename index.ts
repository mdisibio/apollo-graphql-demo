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

    const linkedTypes = `
        extend type Book {
            firstAuthor: Author
        }
    `;

    const resolvers = {
        Book: {
            firstAuthor: {
                fragment: `... on Book { id }`,
                resolve(book, args, context, info) {
                return info.mergeInfo.delegateToSchema({
                    schema: authorSchema,
                    operation: 'query',
                    fieldName: 'author',
                    args: {
                        id: book.authorIds[0],
                    },
                    context,
                    info,
                });
                },
            },
        }
    };


    const schema = mergeSchemas({
        schemas: [
            bookSchema,
            authorSchema,
            linkedTypes
        ],
        resolvers
    })

    const server = new ApolloServer({ schema });
    const { url } = await server.listen();
    console.log(`🚀  Server ready at ${url}`);
})();