import { GraphQLSchema } from 'graphql';
import dataloader from 'dataloader';

// Add Author object under Book.  Loads author by ID
// by delegating to authorSchema.
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
    };
}
