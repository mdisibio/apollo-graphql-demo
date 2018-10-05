# apollo-graphql-demo

This demo project was created an an exercise to become personally familiar with GraphQL but also to explore how it could be added on top of an existing solution.  This is a common problem for any modern software developer, who might have various restful APIs at hand, and would like to extend them with GraphQL and add new cross-api abilities.  

The following GraphQL capabilities are demonstrated:
- [x] Rest-based data fetching
- [x] Remote schemas
- [x] Schema delegation
- [x] Schema stitching
- [x] Batching with DataLoader
- [ ] Transforms
- [ ] Subscriptions
- [ ] Tracing
- [ ] Authorization
- [ ] Mutation

This project is modelled in a microservices style.  This is done to simulate how a large GraphQL implementation could be achieved on top of existing microservices, and also how to stich the schemas together too much coupling.  

1. Two basic restful apis to query data about authors and books.  These represent the "legacy" services that already exist.
1. Two graphQL services that wrap the restful apis.  These demonstrate how to build a simple graphQL api on top of restful apis.  These services are useful on their own.
1. A final graphQL service that stitches the sub-schemas together while also adding new cross-schema resolvers.

![Alt text](https://g.gravizo.com/svg?digraph%20G%20{;%20%20%20%20rankdir=LR;%20%20%20%20node[shape=box];%20%20%22Final%20GQL%22%20-%3E%20{%22Authors%20GQL%22,%20%22Books%20GQL%22}%20[label=delegate];%20%20%22Authors%20GQL%22%20-%3E%20%22Authors%20restful%20API%22;%20%20%22Books%20GQL%22%20-%3E%20%22Books%20restful%20API%22;%20%20})


# Example

Query:
```
query {
  books {
    title,
    author {
      name
    }
  }
  
  authors {
    name
  }
}
```

Returns:
```{
  "data": {
    "books": [
      {
        "title": "Harry Potter and the Chamber of Secrets",
        "author": {
          "name": "J.K. Rowling"
        }
      },
      {
        "title": "Harry Potter and the Goblet of Fire",
        "author": {
          "name": "J.K. Rowling"
        }
      },
      {
        "title": "Jurassic Park",
        "author": {
          "name": "Michael Crichton"
        }
      }
    ],
    "authors": [
      {
        "name": "J.K. Rowling"
      },
      {
        "name": "Michael Crichton"
      }
    ]
  }
}
```

# Running

* `git clone` the repository
* `npm start`
* You should see startup text: 
```
🚀  Books api ready at http://localhost:8081
🚀  Authors api ready at http://localhost:8083/
🚀  Books gql ready at http://localhost:8082/
🚀  Authors gql ready at http://localhost:8084/
🚀  Server ready at http://localhost:4000/
```
* Browse to http://localhost:4000/

Each micro-service can also be accessed individually, and the graphql servers all include the graphql playground.
