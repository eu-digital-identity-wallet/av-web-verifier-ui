<!--
SPDX-FileCopyrightText: 2025 European Commission

SPDX-License-Identifier: Apache-2.0
-->

![Proof of age attestations for all Europeans - An age verification solution for EU citizens and residents](./docs/media/top-banner-av.png)

<h1 align="center">
    Age Verification (AV) Verifier Service Frontend
</h1>

<p align="center">
    <a href="/../../commits/" title="Last Commit"><img src="https://img.shields.io/github/last-commit/eu-digital-identity-wallet/av-verifier-ui?style=flat"></a>
    <a href="/../../issues" title="Open Issues"><img src="https://img.shields.io/github/issues/eu-digital-identity-wallet/av-verifier-ui?style=flat"></a>
    <a href="./LICENSE" title="License"><img src="https://img.shields.io/badge/License-Apache%202.0-green.svg?style=flat"></a>
</p>

<p align="center">
  <a href="#about">About</a> •
  <a href="#disclaimer">Disclaimer</a> •
  <a href="#development">Development</a> •
  <a href="#documentation">Documentation</a> •
  <a href="#support-and-feedback">Support</a> •
  <a href="#code-of-conduct">Code of Conduct</a> •
  <a href="#licensing">Licensing</a>
</p>

## About

The Age Verification Verifier Service is part of the Age Verification Solution Toolbox and serves as a component that can be used by member states, if necessary, to develop a national solution and build upon the building blocks of the toolbox.

The Verifier Service consists of two components: the frontend (UI) and the actual verifier backend. This repository contains only the source code of the Age Verification Verifier Service frontend. To operate and use the verifier, it is necessary to install both the frontend and the backend.

This frontend is a minimal version of a verifier frontend, designed to make it easier for relying parties and to provide a simple illustration of how to use the verifier service.

A more comprehensive and illustrative use case for a verifier can be found in the repository [StarFilm](https://github.com/eu-digital-identity-wallet/av-verifier-frontend-starfilm), which is based on a fictional cinema portal.

## Disclaimer

This is an initial version of the software, developed solely for the purpose of demonstrating the business flow of the solution. It is not intended for production use and does not yet include the full set of functional, security, or integration features required for a live deployment.

The current release provides only basic functionality, with several key features to be introduced in future versions, including:
- Support for batch issuing
- App and device verification based on Google Play Integrity API and Apple App Attestation
- Additional issuance methods beyond the currently implemented eID-based method

These planned features align with the requirements and methods described in the Age Verification Profile.

This version should be considered a foundational prototype to support early testing, feedback, and integration discussions.

**Important limitations:**
- The initial development release may be changed substantially over time and might introduce new features, change, or remove existing ones, potentially breaking compatibility with your existing code.
- The initial development release may contain errors, design flaws, or other problems that could cause system or other failures and data loss.
- The initial development release has reduced security, privacy, availability, and reliability standards relative to future releases. This could make the software slower, less reliable, or more vulnerable to attacks than mature software.
- The initial development release is not yet comprehensively documented.
- Users of the software must perform sufficient engineering and additional testing to properly evaluate their application and determine whether any of the open-sourced components are suitable for use in that application.
- We strongly recommend not putting this version of the software into production use.
- Only the latest version of the software will be supported.

## Development

**Note:** The verifier service needs a configured connection to a compatible verifier backend service. There is no standalone version available.

### Prerequisites

- [Node.js](https://nodejs.org/en): Install the latest version of Node.js, which provides the runtime environment and npm.
- [npm](https://www.npmjs.com): Used to manage project dependencies, including TypeScript itself.
- [Docker](https://www.docker.com): Required for containerized builds and deployments.
- An installation of the [EUDI Verifier Endpoint](https://github.com/eu-digital-identity-wallet/eudi-srv-web-verifier-endpoint-23220-4-kt).
- Authenticate to [GitHub Packages](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-apache-maven-registry).

#### Authenticating into GitHub Packages

As some of the required libraries (and/or versions are pinned/available only from GitHub Packages), you need to authenticate to [GitHub Packages](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-apache-maven-registry). The following steps need to be followed:

- Create a [PAT](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token) with the following scope:
  - `read:packages` for downloading packages.

##### GitHub Docker Registry

- Run `docker login docker.pkg.github.com/eu-age-verification` before running further Docker commands:
  - Use your GitHub username.
  - Use the generated PAT as the password.

### Build

Whether you cloned or downloaded the 'zipped' sources, you will find the sources in the chosen checkout directory. Alternatively, you can expand the zip file to a folder of your choice.

In either case, open a terminal pointing to the directory where you placed the sources. The local build process is described below, depending on the method you choose.

#### Build the verifier from a local directory
Building this project is done with Vite.  

**1. Clone the repository from GitHub:**
```shell
# Replace <your-repository-url> with the actual repository URL
# Replace <your-project-directory> with the desired directory name

git clone <your-repository-url>
cd <your-project-directory>
```

**2. Copy the Environment Configuration:**
```shell
cp .env.example .env
```

**3. Configure the Backend URL:**
  * Open the newly created `.env` file in a text editor (e.g., VS Code, Nano).
  * Update the `VITE_VERIFIER_BASE_URL` variable with the URL of your Verifier backend:
    ```
    VITE_VERIFIER_BASE_URL=http://your-backend-url
    ```

**4. Set npm to Use Legacy Peer Dependencies:**
  * Configure npm to resolve peer dependency conflicts:
    ```shell
    npm config set legacy-peer-deps true
    ```

**5. Install Dependencies:**
  * Install all required dependencies:
    ```shell
    npm install
    ```
  * Setting `legacy-peer-deps` ensures npm ignores peer dependency conflicts during installation.

**6. Start the Application:**
  * Run the development server:
    ```shell
    npm run dev
    ```

**7. Access the Application:**
  * Open your browser and navigate to `http://localhost:5173`.
  * You should see the Verifier web application running locally.

**Note:**
- Ensure your Node.js and npm versions are compatible with the project requirements.
- The backend service must be running and accessible at the URL specified in the `.env` file.

### Run with Docker

If you prefer to use Docker, follow these steps:

**1. Build the Docker Image:**
  * Run the following command from the project root folder:
    ```shell
    docker build -t <image-name>:<tag> .
    ```
  * Replace `<image-name>` with a name for your image.
  * `<tag>` is optional (e.g., `latest`). If omitted, it defaults to `latest`.
  * The dot `.` at the end specifies that the Dockerfile is in the current directory.

  **Example:**
  ```shell
  docker build -t av-verifier-ui:latest .
  ```

**2. Start a Docker Container:**
  * Run the following command to start the container:
    ```shell
    docker run -d -p 5173:5173 av-verifier-ui:latest
    ```
  * `-d` runs the container in detached mode (in the background).
  * `-p 5173:5173` maps port 5173 of the container to port 5173 on your host (adjust the port if your app uses a different one).

**3. Access the Application:**
  * After the container starts, open your browser and navigate to `http://localhost:5173`.
  * The Verifier web application should now be accessible.

**Note:**
- Ensure Docker is installed and running on your system.
- Verify that no other application is using port 5173 on your host machine.

## Documentation

For detailed technical specifications and further information, refer to the [Age Verification Solution Technical Specification](https://github.com/eu-digital-identity-wallet/av-doc-technical-specification).

## Support and Feedback

We welcome discussions, feedback, and support requests through the following channels:

| Type              | Channel                                                                 |
|-------------------|-------------------------------------------------------------------------|
| **Issues**        | <a href="/../../issues" title="Open Issues"><img src="https://img.shields.io/github/issues/eu-digital-identity-wallet/av-verifier-ui?style=flat"></a> |
| **Other Requests**| <a href="mailto:opensource@telekom.de" title="Email AVS Team"><img src="https://img.shields.io/badge/email-AVS%20team-green?logo=mail.ru&style=flat-square&logoColor=white"></a> |

## Code of Conduct

This project adheres to the [Contributor Covenant](https://www.contributor-covenant.org/) version 2.1 as its code of conduct. Please review the details in our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). All contributors are expected to abide by the code of conduct at all times.

By participating in this project, you agree to adhere to its [Code of Conduct](./CODE_OF_CONDUCT.md).

## Licensing

Copyright (C) 2025 European Commission, Scytales, T-Systems International GmbH, and all other contributors.

This project complies with the [REUSE standard for software licensing](https://reuse.software/). Each file includes copyright and license information, and license texts are available in the [./LICENSES](./LICENSES) folder. For more details, visit [REUSE Software](https://reuse.software/). A developer guide is also available at [REUSE Template Guide](https://telekom.github.io/reuse-template/).

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the LICENSES folder.
