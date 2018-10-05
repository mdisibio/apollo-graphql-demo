import {ApolloServer, gql, introspectSchema, makeRemoteExecutableSchema, mergeSchemas } from 'apollo-server'
import { HttpLink } from 'apollo-link-http';
import fetch from 'cross-fetch';
import dataloader from 'dataloader';

import './api_books';
import './gql_books';

import './api_authors';
import './gql_authors';
import { GraphQLSchema } from 'graphql';

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
    const bookSchema = await loadRemoteSchema('http://localhost:8082')
    const authorSchema = await loadRemoteSchema('http://localhost:8084')

    const linkedTypes = `
        extend type Book {
            author: Author
        }
    `;

    const resolvers = {
        Book: {
            author: {
                fragment: `... on Book { authorId }`,
                resolve(book, args, context, info) {
                    if(!context.authorLoader) {
                        context.authorLoader = new dataloader(ids => {
                            const promises = ids.map(id => info.mergeInfo.delegateToSchema({
                                schema: authorSchema,
                                operation: 'query',
                                fieldName: 'author',
                                args: {
                                    id
                                },
                                context,
                                info,
                                }));
                            return Promise.all(promises);
                        });
                    }
                    return context.authorLoader.load(parseInt(book.authorId));
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