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
    ![REUSE Status]
    (https://github.com/T-Scy/av-verifier-ui/actions/workflows/license_check.yaml/badge.svg)

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

The Age Verification Verifier Service is part of the Age Verification Solution Toolbox and serves as a component that can be used by memberstates, if necessary, to develop a national solution and build upon the building blocks of the toolbox.

The Verifier Service consists of two components: the frontend (UI) and the actual verifier backend. This repository contains only the source code of the Age Verification Verifier Service frontend. To operate and use the verifier, it is necessary to install both the frontend and the backend.

This frontend is a minimal version of a verifier frontend, designed to make it easier for relying parties and to provide a simple illustration of how to use the verifier service.

A more comprehensive and illustrative use case for a verifier can be found in the repository [StarFilm](https://github.com/eu-digital-identity-wallet/av-verifier-frontend-starfilm), which is based on a fictional cinema portal.

## Disclaimer

This is an initial version of the software, developed solely for the purpose of demonstrating the business flow of the solution. It is not intended for production use, and does not yet include the full set of functional, security, or integration features required for a live deployment.

The current release provides only basic functionality, with several key features to be introduced in future versions, including:
 - Support for batch issuing
 - App and device verification based on Google Play Integrity API and Apple App Attestation
 - Additional issuance methods beyond the currently implemented eID based method. 

These planned features align with the requirements and methods described in the Age Verification Profile.

This version should be considered a foundational prototype to support early testing, feedback, and integration discussions.
- The initial development release may be changed substantially over time and might introduce new features but also may change or remove existing ones, potentially breaking compatibility with your existing code.
- The initial development release may contain errors or design flaws and other problems that could cause system or other failures and data loss.
- The initial development release has reduced security, privacy, availability, and reliability standards relative to future releases. This could make the software slower, less reliable, or more vulnerable to attacks than mature software.
- The initial development release is not yet comprehensively documented.
- Users of the software must perform sufficient engineering and additional testing to properly evaluate their application and determine whether any of the open-sourced components are suitable for use in that application.
- We strongly recommend not putting this version of the software into production use.
- Only the latest version of the software will be supported

## Development

**Note:** The verifier service needs a configured connection to a compatible verifier backend service. There is no standalone version available.

### Prerequisites

- [Node.js](https://nodejs.org/en): Install the latest version of Node.js, which provides the runtime environment and npm
- [npm](https://www.npmjs.com): Used to manage project dependencies, including TypeScript itself
- [Docker](https://www.docker.com)
- An installation of the [EUDI Verifier Endpoint](https://github.com/eu-digital-identity-wallet/eudi-srv-web-verifier-endpoint-23220-4-kt)
- Authenticate to [Github Packages](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-apache-maven-registry)

#### Authenticating in to GitHub Packages

As some of the required libraries (and/or versions are pinned/available only from GitHub Packages) You need to authenticate
to [GitHub Packages](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-apache-maven-registry)
The following steps need to be followed

- Create [PAT](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token) with scopes:
  - `read:packages` for downloading packages

##### GitHub Docker Registry

- Run `docker login docker.pkg.github.com/eu-age-verification` before running further docker commands.
  - Use your GitHub username as username
  - Use the generated PAT as password
  
### Build

Whether you cloned or downloaded the 'zipped' sources you will either find the sources in the chosen checkout-directory or get a zip file with the source code, which you can expand to a folder of your choice.

In either case open a terminal pointing to the directory you put the sources in. The local build process is described afterwards depending on the way you choose.

#### Build the verifier from a local directory
Building this project is done with vite.  

**1. Clone the repository from GitHub with:** 
```shell
git clone <your-repository-url>
cd <your-project-directory>
```

**2. Copy Environment Configuration**
```shell
cp .env.example .env
```

**3. Configure Backend URL**
  * Open the newly created .env file in a text editor.
  * Set the URL for your Verifier backend by updating the relevant variable (VITE_VERIFIER_BASE_URL=http://your-backend-url).

**4. Set npm to Use Legacy Peer Dependencies**
  * Configure npm to use legacy peer dependency resolution:
```shell
npm config set legacy-peer-deps true
```
* This avoids installation errors due to peer dependency conflicts.

**5. Install Dependencies**
  * Install all required dependencies:
```shell
npm install
```
 * Because you set legacy-peer-deps to true, npm will ignore peer dependency conflicts during installation.

**6. Start the Application**
 + Run the development server:
 ```shell
npm run dev
```
**7. Access the Application**
  * Open your browser and navigate to http://localhost:5173.
  * You should see the Verifier web application running locally.

*Note:*
* If you encounter any issues with dependencies, ensure that your Node.js and npm versions are compatible with the project requirements.
* The backend service must be running and accessible at the URL you specified in the .env file.



#### Run with docker
* Perform build as described above
* Run the following command from the project root folder

```shell
docker build -t <image-name>:<tag> .
```
* Replace &lt;image-name&gt; with a name for your image.
* &lt;tag&gt; is optional (e.g., latest). If omitted, it defaults to latest.
* The dot . at the end specifies that the Dockerfile is in the current directory.
* Example: 
```shell
docker build -t av-verifier-ui:latest .
```
* Start a container using:
```shell
docker run -d -p 5173:5173 av-verifier-ui:latest
```
* -d runs the container in detached mode (in the background).
* -p 5173:5173 maps port 5173 of the container to port 5173 on your host (adjust the port if your app uses a different one).

Now your Docker image is built and you can run a container from it! After all containers have started, you will be able to reach the service on your [local machine](http://localhost:5173) under port 5173.

## Documentation  

[Age Verification Solution Technical Specification](https://github.com/eu-digital-identity-wallet/av-doc-technical-specification)

## Support and feedback

The following channels are available for discussions, feedback, and support requests:

| Type                     | Channel                                                |
| ------------------------ | ------------------------------------------------------ |
| **Issues**    | <a href="/../../issues" title="Open Issues"><img src="https://img.shields.io/github/issues/eu-digital-identity-wallet/av-verifier-ui?style=flat"></a>  |
| **Other requests**    | <a href="mailto:opensource@telekom.de" title="Email AVS Team"><img src="https://img.shields.io/badge/email-AVS%20team-green?logo=mail.ru&style=flat-square&logoColor=white"></a>   |

## Code of Conduct

This project has adopted the [Contributor Covenant](https://www.contributor-covenant.org/) in version 2.1 as our code of conduct. Please see the details in our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). All contributors must abide by the code of conduct.

By participating in this project, you agree to abide by its [Code of Conduct](./CODE_OF_CONDUCT.md) at all times.

## Licensing

Copyright (C) 2025 European Commission, Scytales, T-Systems International GmbH and all other contributors.

This project follows the [REUSE standard for software licensing](https://reuse.software/). Each file contains copyright and license information, and license texts can be found in the [./LICENSES](./LICENSES) folder. For more information visit https://reuse.software/. You can find a guide for developers at https://telekom.github.io/reuse-template/.  

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the LICENSES folder.
