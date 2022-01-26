# GENERAL GUIDELINES

## Main Concepts

- User Acceptance Development
- Test Driven Development
- Mockup Based UI Development
- Contract Based API Development
- Bug Tracking

## System Requirements

- Must use git submodules!
- Programming Languages : Typescript, Javascript, NodeJS
- Development Environment :
  - Runner : TinqJs, Yarn
  - Deployer : TinqJs, Helm
  - Container : Docker, Kubernetes
- Production Environment :
  - Container : Docker, Kubernetes
  - APM : Grafana, Prometheus
  - Reverse Proxy : Nginx (Ingress)
- Services :
  - Endpoints : REST API
  - Middlewares : RabbitMQ
  - SSO : OpenId Connect 1.0
- Backend Frameworks : TinqJs, ExpressJs
- Frontend Frameworks : NextJs, React Hook Framework, TinqJs Components
- Data Adapters : TypeOrm, NodeRedis
- Data Sources : PostgreSQL, Oracle, Redis
- Cache Sources : Redis

## Repositories

## Coding Conventions

## Folder Structures

### Root Project Structures

- Root Project
  - .dev
    - Dockerfile
    - .dockerignore
    - setup.sh
  - lib
    - data-contract
    - openapi-contract
    - rabbitmq-contract
  - services
    - project-next1 (_user interface_)
    - project-next2 (_user interface_)
    - **_. . ._**
    - project-service1 (_backend service_)
    - project-service2 (_backend service_)
    - **_. . ._**
  - README.md
  - CONTRIBUTIONS.md
  - .gitignore
  - lerna.json
  - package.json
  - tinqjs.config.json
  - tsconfig.json

### Service Project Structures

- Service Project
  - **chart (_helm chart_)**
  - **src (_optional_)**
    - **db (_optional_)**
      - **entities**
      - **adapters (_optional_)**
      - index.ts (_boot orm_)
    - **handlers**
      - **mq (_optional_)**
        - index.ts (_boot mq consumers_)
      - **routes (_optional_)**
        - index.ts (_boot routes_)
      - index.ts (_boot handlers_)
    - **actions (_main logic_)**
    - **services (_wrapped actions_)**
      - index.ts (_boot services_)
    - **guards (_authorization and permissions_)**
    - index.ts (_bootstrap_)
  - .gitignore
  - .dockerignore
  - .gitlab-ci.yml
  - Dockerfile
  - package.json
  - tinqjs-service.config.json
  - tsconfig.json

### Next Project Structures

- **Next Project**
  - **chart (_helm chart_)**
  - **components**
  - **pages**
    - \_app.tsx (_boot app_)
    - \_document.tsx
  - **services (_hooks_)**
    - index.ts (_boot services_)
  - **session**
    - **tokens**
    - **selectors**
    - **mutators**
    - index.ts (_boot session_)
  - **states**
    - **atoms**
    - **selectors**
    - **mutators**
    - index.ts (_boot states_)
  - **guards**
  - **sdk**
  - **utils**
  - **public**
  - **styles**
  - .gitignore
  - .dockerignore
  - .gitlab-ci.yml
  - next-env.d.ts
  - next.config.ts
  - postcss.config.js
  - tailwind.config.js
  - index.js (_boot server_)
  - Dockerfile
  - package.json
  - tinqjs-service.config.json
  - tsconfig.json

### Data Source Contract Structures

- **Data Source Contract**
  - **src**
    - **model**
    - **adapter (_optional_)**
    - index.ts (_export contracts_)
  - package.json
  - tsconfig.json

### Backend Contract Structures

- **Backend Contract**
  - **assets**
  - **src**
    - **schemas**
    - **routes (_optional_)**
      - index.ts (_export route contracts_)
    - **consumers (_optional_)**
      - index.ts (_export consumer contracts_)
    - **resolvers (_optional_)**
      - index.ts (_export resolver contracts_)
    - **subscribers (_optional_)**
      - index.ts (_export subscriber contracts_)
    - **services (_optional_)**
      - index.ts (_export service contracts_)
    - index.ts (_export contracts_)
  - package.json
  - tsconfig.json

## Gathering Requirements

### How to Write User Acceptances

1. Identify Stakeholders
2. Identify Dependencies (_other apps/services_)
3. Write the Abstract
4. Write Epics
5. Write User Stories
6. Write Questioners
7. Write Story Descriptions
8. Write Acceptance Scenarios (_repeat from point "4" if needed_)

### How to Write Test Scripts

1. Describe Input (_strict input data format_)
2. Describe Rules
3. Describe Scenarios
4. Describe Output (_strict output data format_)
5. Write Test Scripts

### How to Draw Mockups

1. Define Sitemap
2. Define Components
3. Define Styles
4. Draw Mockups

### How to Write Contracts

1. Write Data Contract (_model_)
   - Permissions
   - Mapping
2. Write Request Contract (_parameter_)
3. Write Response Contract (_response_)

## Development

### Workflow Overview

**_1. Request Flow_**

![Request Flow!](https://i.ibb.co/YdDj9xk/Alwildan-Page-13-drawio.png "Request Flow Diagram")

**_2. Response Flow_**

![Response Flow!](https://i.ibb.co/ct6Z64L/Alwildan-Page-13-drawio-1.png "Response Flow Diagram")

### Prepare Development Environment

**_Development Configs_**

1. Database (development) : xxx.xxx.xxx.xxx
2. Redis (development) : xxx.xxx.xxx.xxx
3. SSO (development) : xxx.xxx.xxx.xxx
4. RabbitMQ (development) : xxx.xxx.xxx.xxx

**_Install Docker_**

```sh
apt install docker

or

choco install docker
```

**_Install Visual Studio Code_**

```sh

```

**_Install NodeJs_**

```sh

```

**_Install Development Containers_**

```sh

```

**_Attach VS Code to Container_**

```sh

```

**_Download Module (optional)_**

```sh

```

**_Start Application_**

```sh

```

### Update Development Environment

Always write any changes to system envirnoment in .dev/setup.sh

## Deployment
