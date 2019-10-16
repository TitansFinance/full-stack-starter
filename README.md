# FullStackStarter

A set of containerized, production-ready, fullstack web and microservice applications.


## Dependencies
- Docker
- Docker Compose

or

- NodeJS 10.x.x


## File Structure

```
    .
    ├── gateway - NodeJS GraphQL gateway service
    ├── microservice - NodeJS Microservice template
    ├── webclient - NextJS Webclient and server rendering service
    └── data - temp folder for persistent application state data (ie redis, postgres)
```


## Development

Services can be run with docker / docker-compose, or individually via locally installed node.js.

### Build

```bash
docker-compose build
```


### Run

```bash
docker-compose up
```


## Production

Local images, identical to production, may be built and run.

```bash
docker-compose -f docker-compose.production.yml build
docker-compose -f docker-compose.production.yml up
```

In production, images are orchestrated by Baremetal Kubernetes on Centos7.


## Continuous Integration and Deployment

1. Jenkins Pipeline watches repositories and builds images for development.
2. Sets of images are hoisted by version to Staging.
3. Staging builds are release to Production.


## Debugging Containers

Sometimes containers need to be re-built, especially after new node_modules have been installed or updated.
```bash
docker-compose build --no-cache [SERVICE1, SERVICE2, SERVICE3]
# Example:
docker-compose build --no-cache # build all
docker-compose build --no-cache ethereum-rpc-service # build one
docker-compose build --no-cache ethereum-rpc-service wallet-service # build several
```

To enter a running container:
```bash
docker-compose exec CONTAINER_NAME bash
# Example:
docker-compose exec wallet-service bash
docker-compose exec ethereum-rpc-service sh # for linux-based containers that only have sh installed
docker-compose exec postgres psql -U postgres # for postgres
```


## License

See LICENSE
