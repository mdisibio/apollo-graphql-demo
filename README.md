# apollo-graphql-demo

This demo project was created an an exercise to become personally familiar with GraphQL but also to explore how it could be added on top of an existing fleet of enterprise services.  This is a common problem for a software developer who might have various restful APIs at hand, and would like to extend them with GraphQL and add new cross-api abilities.  

The following GraphQL capabilities are demonstrated:
- [x] Rest-based data fetching
- [x] Remote schemas
- [x] Schema delegation
- [x] Schema stitching
- [x] Batching with DataLoader
- [ ] Transforms
- [x] Subscriptions
- [x] Tracing
- [ ] Authorization
- [x] Mutation
- [ ] Sorting
- [ ] Limiting
- [ ] Pagination
- [ ] Fragments

This project is modelled in a microservices style, to match common scenarios in API design.  It also tests how a GraphQL implementation could "scale" across teams and domains to introduce the benefits of GraphQL, while avoiding coupling and coordination.

The goals are:
- Independent deployment and technology of backing services
- Independent definition of per-domain schemas
- Schema not duplicated in the front-end GraphQL server
- All types and operations are defined in exactly one place

# Project structure

There are 2 rest-ful backing services, which are wrapped by domain-specific GraphQL services.  A front-end GraphQL service exposes the all functionality of the domain-specific schemas, while also adding cross-schema operations through stitching and delegation. 

    └── Front-end GQL         # Cross-schema operations

        └── Authors GQL       # Author GraphQL operations
            └── Authors API   # Rest-ful backing service for Authors data

        └── Books GQL         # Books GraphQL operations
            └── Books API     # Rest-ful backing service for Books data

# Example

This front-end query will read all books, and perform an inner lookup to read the author information from the other backing service.

```
query {
  books {
    title,
    author {
      name
    }
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
    ]
  }
}
```

# Running

* `git clone` the repository
* `docker-compose build`
* `docker-compose up`
* You should see startup text: 
```
🚀  Graphsql server ready at http://localhost:4000/
```
* Browse to http://localhost:4000/