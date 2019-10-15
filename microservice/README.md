# Microservice


## Dependencies
- docker
- node + npm
- yarn


## Setup

```bash
yarn setup
```

## File Structure

```
    .
    ├── index.js - entrypoint
    ├── main.js - bootstrap
    ├── lib - application logic
    ├── test
    │     ├── integration
    │     └── unit
    │
    ├── singletons - entrypoints for singletons
    └── constructors - entrypoints for classes and module constructors, such as Express, Sequelize, etc.

```


## Run

```bash
yarn dev
```


## Test

Tests are split into unit and integration.

```bash
yarn test:unit  # matches ( test/unit/*.test.js | **/unit.test.js )
yarn test:unit:watch
yarn test:integration # matches ( test/integration/*.test.js | **/integration.test.js )
yarn test:integration:watch
```


## Production

```bash
yarn start
```


## License

See LICENSE
