# Express server template - in typescript
## Reasoning - why using express nowadays?

### Problems?
 - Handling async errors (npm express-async-errors) #4360, #4348,...
 - Relate to above => before Node 15, any unhandled Rejection will just throw a warning, 
but the case from >= 15 that any undandledRejection now will considered an error
 - Not having an easy way to list all registered routes (npm express-routes)
 - Express v5 in development for years.. =>
Last stable version of Express was released years ago! They do have an alpha version of 5.0.0 up on NPM, published just 1 year ago, but that one seems to be dead, as no commits were made to the Github 5.0 branch in 15 months.
The last commits on the master branch are one just month old, though, so there's definitely still something going on there. Quite odd, though, that they haven't released anything in 2 years even though they are still maintaining the source code. In 2 years, you'd expect at least some synchronization between repo & release.
 - PR opened in express repo for over 2 years with no comments from dev-team
 - no plans for http2
 - better alternatives if u talk about performance
 - nothing is build in except the barebone, so you have to assemble everything from 0

### Pros?
 - everyone's familiar with it
 - huge, mature and battle-tested ecosystem
 - every article shows examples with express
 - most companies have this boilerplate already coded, cors, loggers, linter, 
and can spint projects pretty simply - u just have to build new front-ends
 - it works, its simple and flexible
 - tutorials, middleware/plugins, and tooling made for Express over the years
 - good "go to" option with graphql
 - community

Generally my opinion is good about Express, but moving forward I would go with NestJS,
as its an express under the hood, and its really ok to migrate to (learnign curve, introducing team)

## About the project template
I use CI/CD tools, so the Dockerfile is picked up by it, and that is enough to run production app.
docker-compose.yaml is here only for sake of local development, when you dont want node/npm on your local machine.

### Env:
#### Database connection

Decide upon database, but when going with mongo, env vars are required.

 - MONGODB_HOST
 - MONGODB_PORT
 - MONGODB_USER
 - MONGODB_PASSWORD
 - MONGODB_NAME
 - MONGODB_SSL
 - MONGODB_REPLICA_SET

You could also consider using native mongo client - ligthweight mongodb lib
or go with mongoose when you need db modeling in code.
Both clients and connection example is in codebase /srd/clients/*
Remember to cleanup package.json from the one you wont use.

There would be also an option to use typegoose but its not presented here.

#### CORS SETTINGS
- CORS_ORIGINS - http://localhost:8086|http://other.local:8085

## Set up locally

### Development with docker

#### Prepare .env file
```
cp ./.env.dev ./.env
```

#### Test
```
npm t
```
in container should be enough

#### Linter
```
npm run eslint
npm run eslint-fix
```
in container should do :)

#### Run app:
```
docker-compose build && docker-compose up -d
```

#### Connect to db
```
docker exec -it template_mongodb mongo
```
