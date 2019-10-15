# Gateway

## Dependencies
- docker
- docker-compose

## Setup

```bash
yarn setup
```

## Start

```bash
yarn dev
open http://127.0.0.1:8000/graphql
open http://127.0.0.1:8000/api/v1/health
```

## File Structure

```
    .
    ├── index.js - entrypoint
    ├── main.js - bootstrap
    ├── bin - internal infrastructure executables, such as migrate scripts
    ├── public - public files served in http requests
    ├── constants - common constant values
    ├── utils - common utility files
    ├── logs - server log files
    │
    ├── test
    │     ├── integration
    │     └── unit
    │
    └── constructors - primary entrypoint for large modules, such as Express, Apollo Graphql, Sequelize, etc.
             ├── sockets
             ├── sequelize
             │       ├── config
             │       ├── migrations
             │       ├── models
             │       └── seeders
             └── express
                   ├── routes
                   └── apollo
                         ├── types
                         ├── directives
                         └── resolvers
                                 ├── queries
                                 ├── mutations
                                 └── subscriptions


```


## Migrations

Sequelize migrations. Migrations run automatically on bootstrap when the related gateway migrations flag is enabled.

If you want to trigger manually, execute migrations while docker containers are running:
```bash
docker-compose exec gateway yarn migrate
```

See files:
```
    .
    ├── main.js
    └── constructors
             └── sequelize
                     └── migrations

```

## Seeds

Sequelize seeds. Seeds run automatically on bootstrap when the related gateway seeds flag is enabled.

See files:
```
    .
    ├── main.js
    └── constructors
             └── sequelize
                     └── seeders

```

```bash
docker-compose exec gateway yarn seed
```


## Test

Tests are split into unit and integration.

```bash
yarn test:unit  # matches ( test/unit/*.test.js | **/unit.test.js )
yarn test:unit:watch
yarn test:integration # matches ( test/integration/*.test.js | **/integration.test.js )
yarn test:integration:watch
```

## Notes and Links

Internal
- Docker Registry: https://repository.trustedlife.app
- Docker Registry UI: https://repository-ui.trustedlife.app

Ethereum Faucets
- https://etherfaucet.xyz
- https://testnet-faucet.mempool.co/


## License

Unlicensed