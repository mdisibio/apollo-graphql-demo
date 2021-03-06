//------------------------------------------------------
// Book.Author field
//
// This module extends the GraphQL schema with a new 
// field Book.Author.  Fetch is delegated to the existing
// Author schema which means all fields and methods that
// already exist on Author are available to Author 
// children in each Book object.
//
// This resolver uses DataLoader to batch/coalesce 
// requests for duplicate Authors in the same query.
// This means that if two books have the same author
// it will only query the sub-schema for the author's
// info once.
//------------------------------------------------------

import { GraphQLSchema } from 'graphql';
import dataloader from 'dataloader';

export function AddBooksAuthor(authorSchema : GraphQLSchema, schemas : any[], resolvers) {
    schemas.push(`
        extend type Book {
            author: Author
        }
    `);

    resolvers.Book = {
        author: {
            // Fragment ensures the required authorId field is always
            // loaded even if the client does not ask for it.
            fragment: `... on Book { authorId }`,

            resolve(book, args, context, info) {

                // Construct Dataloader as needed. NOTE - This
                // will occur once for every request and is the
                // intended way to use Dataloader.

                if(!context.authorLoader) {
                    context.authorLoader = new dataloader(ids => {
                        // This is delegating a method in the author
                        // schema to lookup authors by ID: authorsByID(ids)
                        return info.mergeInfo.delegateToSchema({
                            schema: authorSchema,
                            operation: 'query',
                            fieldName: 'authorsByID',
                            args: {
                                ids
                            },
                            context,
                            info,
                            });
                    });
                }
                return context.authorLoader.load(parseInt(book.authorId));
            },
        },
    };
}
