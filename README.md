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


## License

See LICENSE
