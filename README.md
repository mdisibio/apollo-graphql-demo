# apollo-graphql-demo

This demo project was created an an exercise to become personally familiar with GraphQL but also to explore how it could be added on top of an existing solution.  This is a common problem for any modern software developer, who might have various restful APIs at hand, and would like to extend them with GraphQL and add new cross-api abilities.  

The following GraphQL capabilities are demonstrated:
- [x] rest-based data fetching
- [x] Remote schemas
- [x] Schema delegation
- [x] Schema stitching
- [x] Batching with DataLoader
- [ ] Transforms
- [ ] Subscriptions

This project is modelled in a microservices style.  This is done to simulate how a large GraphQL implementation could be achieved on top of existing microservices, and also how to stich the schemas together too much coupling.  

1. Two basic restful apis to query data about authors and books.  These represent the "legacy" services that already exist.
1. Two graphQL services that wrap the restful apis.  These demonstrate how to build a simple graphQL api on top of restful apis.  These services are useful on their own.
1. A final graphQL service that stitches the sub-schemas together while also adding new cross-schema resolvers.
