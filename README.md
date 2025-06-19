<!--
SPDX-FileCopyrightText: 2025 European Commission

SPDX-License-Identifier: Apache-2.0
-->

![Proof of age attestations for all Europeans - An age verification solution for EU citizens and residents](./docs/media/top-banner-av.png)

<h1 align="center">
    Age Verification (AV) Verifier Service Frontend
</h1>

<p align="center">
  <a href="#about">About</a> •
  <a href="#disclaimer">Disclaimer</a> •
  <a href="#development">Development</a> •
  <a href="#documentation">Documentation</a> •
  <a href="#support-and-feedback">Support</a> •
  <a href="#code-of-conduct">Code of Conduct</a> •
  <a href="#license">Licensing</a>
</p>

## About

The Age Verification Verifier Service is part of the Age Verification Solution Toolbox and serves as a component that can be used by member states, if necessary, to develop a national solution and build upon the building blocks of the toolbox.

The Verifier Service consists of two components: the frontend (UI) and the actual verifier backend. This repository contains only the source code of the Age Verification Verifier Service frontend. To operate and use the verifier, it is necessary to install both the frontend and the backend.

This frontend is a minimal version of a verifier frontend, designed to make it easier for relying parties and to provide a simple illustration of how to use the verifier service.

A more comprehensive and illustrative use case for a verifier can be found in the repository [StarFilm](https://github.com/eu-digital-identity-wallet/av-verifier-frontend-starfilm), which is based on a fictional cinema portal.

## Disclaimer

This is an initial version of the software, developed solely for the purpose of demonstrating the business flow of the solution. It is not intended for production use and does not yet include the full set of functional, security, or integration features required for a live deployment.

The current release provides only basic functionality, with several key features to be introduced in future versions, including:

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

For detailed setup and configuration instructions, please refer to the [Installation and Configuration Guide](./backend-configuration.md).

Once the backend is up and running, it can be tested using the age verification apps for mobile platforms:

- [Android AV Wallet App](https://github.com/eu-digital-identity-wallet/av-app-android-wallet-ui)
- [iOS AV Wallet App](https://github.com/eu-digital-identity-wallet/av-app-ios-wallet-ui)


## Documentation

For detailed technical specifications and further information, refer to the [Age Verification Solution Technical Specification](https://github.com/eu-digital-identity-wallet/av-doc-technical-specification).

## Support and Feedback

We welcome discussions, feedback, and support requests through the following channels:

| Type              | Channel                                                                 |
|-------------------|-------------------------------------------------------------------------|
| **Issues**        | <a href="/../../issues" title="Open Issues"><img src="https://img.shields.io/github/issues/eu-digital-identity-wallet/av-web-verifier-ui?style=flat"></a> |
| **Other Requests**| <a href="mailto:av-tscy@scytales.com" title="Email AVS Team"><img src="https://img.shields.io/badge/email-AVS%20team-green?logo=mail.ru&style=flat-square&logoColor=white"></a> |

## Code of Conduct

This project adheres to the [Contributor Covenant](https://www.contributor-covenant.org/) version 2.1 as its code of conduct. Please review the details in our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). All contributors are expected to abide by the code of conduct at all times.

By participating in this project, you agree to adhere to its [Code of Conduct](./CODE_OF_CONDUCT.md).

## License

Copyright (c) 2025 European Commission

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
