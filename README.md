# Fioneer Starter Frontend

[![.github/workflows/build-every-push.yml](https://github.com/Fioneer-Corporate/fioneer-starter-frontend/actions/workflows/build-every-push.yml/badge.svg)](https://github.com/Fioneer-Corporate/fioneer-starter-frontend/actions/workflows/build-every-push.yml)

URL of starter-frontend application deployed on AKS cluster:
<https://web.285ca376-31ee-438a-8fee-31f476fda1e3.privatelink.westeurope.azmk8s.io/>

URL of starter-frontend application deployed on SAP BTP, Kyma cluster:
<https://fioneer-starter-frontend.c-5dd0b84.kyma.ondemand.com>

## Contents

[About Fioneer Frontend Starter](#about-fioneer-frontend-starter)\
[Available Scripts](#available-scripts)\
[Fioneer NPM Virtual Repository](#fioneer-npm-virtual-repository)\
[Docker files and Deployment](#docker-files-and-deployment)\
[Project Name Replacement](#project-name-replacement)\
[Creating a new project from fioneer-starter-frontend](#creating-a-new-project-from-fioneer-starter-frontend)\
[Setting up Environment Variables](#setting-up-environment-variables)

## About Fioneer Frontend starter

This is a starter repository, which may be used as template for creating a new ReactJS application.

It demonstrates:

  - A ReactJS application with front page and a component.
  - Unit testing examples.
  - GitHub actions to build and test the application.
  - Deployment to a target AKS cluster.
  - Deployment to a target Kyma cluster.
  - Secured app resources using OIDC

The foundation for this project was the [Vite](https://github.com/vitejs/vite).

## Available Scripts

In the project directory, you can run:

  - `npm start`: Runs the app in the development mode.
  - `npm run test`: Launches the test runner and reporter.
  - `npm run test:unit`: Launches the test runner and reporter for unit tests only.
  - `npm run build`: Builds the app for production to the `build` folder
    - See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment)
    for more information.
  - `npm run stylelint` Checks CSS style
  - `npm run stylelint:fix` Fixes CSS style errors
  - `npm run format` Checks prettier code style
  - `npm run format:fix` Fixes prettier code style errors
  - `npm run lint` Checks eslint formatting
  - `npm run lint:fix` Fixes eslint formatting errors
  - `npm run lint-md` Checks Markdown formatting
  - `npm run lint-md:fix` Fixes Markdown formatting errors

## Fioneer NPM Virtual Repository

A [NPM mirror](https://fioneer.jfrog.io/ui/repos/tree/General/fioneer-npm-remote-npmregistry) is maintained in JFrog but
should not be accessed directly. Instead, the [Fioneer NPM virtual repository](https://fioneer.jfrog.io/ui/repos/tree/General/fioneer-npm-virtual)
should be accessed. This virtual repository ensures that artifacts from both the NPM mirror and [Fioneer local NPM
repository](https://fioneer.jfrog.io/ui/repos/tree/General/fioneer-npm-local) are accessible via the virtual repository.

To connect to the Fioneer NPM virtual repository:

  - Get or create your authentication token at JFrog.
  - Open a new terminal. Do not use a Windows terminal. Use a non-Windows terminal (e.g. git bash)

    - Execute the following:

      ```bash
      curl -u 'your.name@fioneer.com:YOUR_API_KEY' https://fioneer.jfrog.io/artifactory/api/npm/auth
      ```

    - Verify the output:

      ```bash
      _auth = SOMEBASE_64_STRING_SDSDF234_wdfsSDF=
      always-auth = true
      ```

    - Edit or create the `.npmrc` file. This file is normally located at `c:\users\<your username>\.npmrc`, if you’re
      not sure, you can run the command line tool `npm config ls -l` to find out the value of this user config.

      - Add the following lines:

        ```text
        @fioneer-npm-virtual:registry = https://fioneer.jfrog.io/artifactory/api/npm/fioneer-npm-virtual/
        //fioneer.jfrog.io/artifactory/api/npm/fioneer-npm-virtual/:_auth = SOMEBASE_64_STRING_SDSDF234_wdfsSDF= #output from Step 2b
        always-auth = true
        email = your.name@sapfioneer.com
        ```

If you need to support different `.npmrc` profiles, then checkout [deoxxa/npmrc](https://github.com/deoxxa/npmrc), which
allows profile switching on the CLI.

## Docker files and Deployment

### Building Docker image in a pipeline

The Docker image is built within the `build` job of the `build-every-push` workflow.

### Building Docker image locally

Since the Docker build requires access to a private NPM registry,
a valid `.npmrc` providing credentials to the registry needs to be supplied
as a build secret. To build the image locally, run the following command
(assuming, `$HOME/.npmrc`) points to a `.npmrc` containing required credentials.

```bash
$ docker build build \
  --progress=plain \
  --tag fioneer.jfrog.io/fioneer-virtual/fioneer-starter/frontend:local \
  --secret id=NPMRC,src=$HOME/.npmrc .

[+] Building ...
  ...
=> => writing image sha256:123abc...
```

### Artifacts in Jfrog

Uploaded artifacts can be seen in\
<https://fioneer.jfrog.io/ui/> \
Under `Artifactory` -> `Arifacts` -> `fioneer-virtual` -> `fioneer-starter`

### Running Docker image from JFrog locally

Refer to the [Onboarding guide](https://fioneer.atlassian.net/wiki/spaces/CL/pages/52199675/Onboarding+-+FAQ#How-do-I-use-the-Artifactory-Docker-registry%3F)

Login to JFrog using\
`docker login -u your.name@fioneer.com fioneer.jfrog.io`

For password - use `API Key` from <https://fioneer.jfrog.io/>, `Edit Profile`, `API Key`

Find the name of the docker image from the pipeline job:\
Pipeline: `Build Docker image and push to JFrog Artifactory`\
Step: `Docker Build`\
Line: `Building Docker image fioneer.jfrog.io/fioneer-virtual`\
Name of the image, example: `fioneer.jfrog.io/fioneer-virtual/fioneer-starter/frontend:main-6d61e65f2564c01eb12a236f639cb27e74b6f8d6`

(Optional step) To pull the image: `docker pull <name of the image>`

To start the image (includes automatic pull)\
`docker run -p 8000:8080 -d fioneer.jfrog.io/fioneer-virtual/fioneer-starter/frontend:main-c867e6aff99b7709b640311c073620d72deebe68`

Front end will start up on port 8000.

## Creating a new project from fioneer-starter-frontend

In the context of Fioneer org we should be using <https://github.com/fioneer/github-repository-setup> for creating a new repo.

Example: <https://github.com/fioneer/github-repository-setup/pull/206>
Note that fioneer-starter-frontend is a template repository, this allows to create copies of it.\
Example of changes in 01-setup/config_repositories.yaml to create a new repo from template:

```text
__<repo name>:
____frontend:
______description: <repo description>
______template: fioneer-starter-frontend
______merge_approver_team: <team name>
______grant_admin_access: true
______grant_npm_permissions: true
______topics:
________- reactjs
________- <your topic
```

After new repository has been created, do the following:\
`.github/workflows/docker-build.yml`\
Update value of `DOCKER_IMAGE_NAME:`

`sonar-project.properties`\
Update value of `sonar.projectKey=`

`package.json`\
Update value of `"name":`

## Setting up Environment Variables

After creating a copy of the template repository, you need to create a new environment following variables and secrets:

For deployment to AKS:

  - `AZURE_CLIENT_ID`: value of Kubernetes services deployer service principal from provisioned Azure infrastructure
  - `AZURE_TENANT_ID`: value that represents an instance of Azure Active Directory (AAD)
  - `AZURE_SUBSCRIPTION_ID`: value comes from provisioned Azure infrastructure

These values are required for GitHub Identify federation with Service Principals in Azure.

For deployment to Kyma:

  - `K8S_URL`: value of Kyma cluster URL (e.g. <https://api.https://api.c-5dd0b84.kyma.ondemand.com>)
  - `K8S_SECRET`: environment secret containing service account secret resource YAML of target deployment namespace.

These values are required to set the kube context for authenticating with the cluster with the service account.

For more information: <https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-azure>
