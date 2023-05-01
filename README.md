# Payment Hub Event Migrator

Analyse V1 event store and migrate events to V2 event store.

This service is intended to be run as a one-off task to migrate events from the V1 event store to the V2 event store.

However, the design does support repeated runs as events that have already been migrated will be skipped.

## Prerequisites

- [Azure Service Bus](https://docs.microsoft.com/en-us/azure/service-bus-messaging/)
- [Docker](https://www.docker.com/)
- Either:
  - [Docker Compose](https://docs.docker.com/compose/install/linux/#install-the-plugin-manually)
  - [Docker-Compose (standalone)](https://docs.docker.com/compose/install/other/)

Optional:
- [Kubernetes](https://kubernetes.io/)
- [Helm](https://helm.sh/)

## Setup

### Configuration

These configuration values should be set in the [docker-compose.yaml](docker-compose.yaml) file or Helm [values file](helm/ffc-pay-event-hub/values.yaml) if running Kubernetes.

| Name | Description | Default |
| ---| --- | --- |
| `STORAGE_CONNECTION_STRING` | Azurite Storage connection string | Azure Storage connection string |
| `CREATE_TABLES` | Create tables on startup, `true` or `false` | `false` |
| `COMPLETE_MIGRATION` | Complete migration or just summarise, `true` or `false` | `true` |

## How to start the service

Docker Compose or Docker can be used to build the container image.

An `output` folder should be created to store the summary files

```
mkdir -p output
```

### Docker Compose


```
docker-compose up --build
```

The service will file watch application and test files so no need to rebuild the container unless a change to an npm package is made.

Environment variables will automatically be loaded from a local `.env` file.

The service can also be run using the [start](scripts/start) script.
```
./scripts/start
```

This script accepts any Docker Compose [Up](https://docs.docker.com/engine/reference/commandline/compose_up/) argument.

### Docker

#### Build

```
docker build -t ffc-pay-event-migrator .
```

#### Run

```
docker run --env-file .env -v ./output:./home/node/output ffc-pay-event-migrator
```
Or:
```
docker run -e STORAGE_CONNECTION_STRING="MY_CONNECTION_STRING" -v ./output:./home/node/output ffc-pay-event-migrator 
```

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.

