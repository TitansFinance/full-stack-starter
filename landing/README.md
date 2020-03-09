# Webclient


## Dependencies
- Docker
- Docker Compose


## File Structure

```
    .
    ├── components
    │       └── App.js - client application root component
    │
    ├── constructors
    │       ├── apollo
    │       ├── redux
    │       ├── i18next.js - i18n translations backend bootstrap
    │       └── next-i18next.js - NextJS i18n SSR translations bootstrap
    │
    ├── pages
    ├── server
    ├── static
    │     └── locales - i18n translation files
    │           ├── en
    │           └── zh
    ├── test
    │     ├── integration
    │     └── unit
    │
    └── styles

```

## Setup

```bash
yarn setup
```


## Run

```bash
yarn dev
open http://127.0.0.1:3000
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
