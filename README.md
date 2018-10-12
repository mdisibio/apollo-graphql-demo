# apollo-graphql-demo

This demo project was created an an exercise to become personally familiar with GraphQL but also to explore how it could be added on top of an existing solution.  This is a common problem for any modern software developer, who might have various restful APIs at hand, and would like to extend them with GraphQL and add new cross-api abilities.  

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

This project is modelled in a microservices style.  This is done to simulate how a GraphQL implementation could be achieved on top of existing microservices, introducing the benefits of GraphQL without also introducing coupling or requiring coordination between services and teams.

The goals are:
- Independent deployment and technology of backing services
- Per-domain schemas in backing services that could be managed by separate teams
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
