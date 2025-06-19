# Installation and Configuration Guide

## Overview

This project provides a minimal backend Verifier service for age verification use cases. It leverages the official [EUDI Verifier Backend Service](https://github.com/eu-digital-identity-wallet/eudi-srv-web-verifier-endpoint-23220-4-kt) to handle the core [OpenID for Verifiable Presentations (OpenID4VP), draft 24](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html) and exposes a simplified React/TypeScript user interface tailored for age verification applications.

### System Components

| Component          | Technology         | Port | Purpose                    |
| ------------------ | ------------------ | ---- | -------------------------- |
| **Backend API**    | Kotlin/Spring Boot | 8080 | Core verification logic    |
| **AV Verifier UI** | React/TypeScript   | 5173 | Age verification interface |

### Application APIs

The application exposes two main APIs:

- **[Verifier API](src/main/kotlin/eu/europa/ec/eudi/verifier/endpoint/adapter/input/web/VerifierApi.kt)**
  - Initialize Transaction
  - Get Wallet Response
- **[Wallet API](src/main/kotlin/eu/europa/ec/eudi/verifier/endpoint/adapter/input/web/WalletApi.kt)**
  - Get Request Object
  - Get Presentation Definition
  - Direct Post

An Open API v3 specification is available at: `http://localhost:8080/public/openapi.json`

## Disclaimer

The released software is an initial development release version:

- This is an early endeavor reflecting the efforts of a short timeboxed period
- May be changed substantially over time
- Limited in functional scope
- May contain errors or design flaws
- Has reduced security, privacy, availability, and reliability standards
- **We strongly recommend not putting this version into production use**

## Quick Start

### Prerequisites

- **Java 21+** 
- **Gradle 8.0+** 
- **Node.js 18+** 
- **npm** or **yarn**

### 1. Backend Setup

```bash
# Clone and navigate to backend
git clone https://github.com/eu-digital-identity-wallet/eudi-srv-web-verifier-endpoint-23220-4-kt
cd eudi-srv-web-verifier-endpoint-23220-4-kt

# Start backend service
./gradlew bootRun
```

### 2. Frontend Setup

```bash
# Navigate to AV Verifier UI
cd av-verifier-ui

# Create .env file with backend URL
echo "VITE_VERIFIER_BASE_URL=http://localhost:8080" > .env

# Install dependencies (if not already done)
npm config set legacy-peer-deps true
npm install

# Start development server
npm run dev
```

**Note**: The AV Verifier UI requires a `.env` file with `VITE_VERIFIER_BASE_URL` pointing to your backend URL. For production, update this to your actual backend URL.

### 3. Access the Application

- **AV Verifier UI**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/public/openapi.json
- **Swagger UI**: http://localhost:8080/swagger-ui

## Configuration

The Verifier Endpoint application can be configured using environment variables:

### Core Configuration

| Variable                    | Description                     | Default                 | Example                   |
| --------------------------- | ------------------------------- | ----------------------- | ------------------------- |
| `SPRING_PROFILES_ACTIVE`    | Spring Profiles to activate     | -                       | `self-signed`             |
| `SERVER_PORT`               | HTTP listener port              | `8080`                  | `8080`                    |
| `VERIFIER_PUBLICURL`        | Public URL of the application   | `http://localhost:8080` | `https://your-domain.com` |
| `VERIFIER_ORIGINALCLIENTID` | Client ID without scheme prefix | `Verifier`              | `MyVerifier`              |
| `VERIFIER_CLIENTIDSCHEME`   | Client ID scheme                | `pre-registered`        | `x509_san_dns`            |

### JWT Signing Configuration

| Variable                         | Description                                 | Default          | Values                               |
| -------------------------------- | ------------------------------------------- | ---------------- | ------------------------------------ |
| `VERIFIER_JAR_SIGNING_ALGORITHM` | Algorithm for Authorization Request signing | `ES256`          | `ES256`, `ES384`, `ES512`            |
| `VERIFIER_JAR_SIGNING_KEY`       | Key for Authorization Request signing       | `GenerateRandom` | `GenerateRandom`, `LoadFromKeystore` |
| `VERIFIER_REQUESTJWT_EMBED`      | How Authorization Requests are provided     | `ByReference`    | `ByValue`, `ByReference`             |
| `VERIFIER_RESPONSE_MODE`         | How Authorization Responses are expected    | `DirectPostJwt`  | `DirectPost`, `DirectPostJwt`        |

### Keystore Configuration (when using `LoadFromKeystore`)

| Variable                                     | Description       | Example                  |
| -------------------------------------------- | ----------------- | ------------------------ |
| `VERIFIER_JAR_SIGNING_KEY_KEYSTORE`          | Keystore URL      | `classpath:keystore.jks` |
| `VERIFIER_JAR_SIGNING_KEY_KEYSTORE_TYPE`     | Keystore type     | `jks`, `pkcs12`          |
| `VERIFIER_JAR_SIGNING_KEY_KEYSTORE_PASSWORD` | Keystore password | `keystore`               |
| `VERIFIER_JAR_SIGNING_KEY_ALIAS`             | Key alias         | `verifier`               |
| `VERIFIER_JAR_SIGNING_KEY_PASSWORD`          | Key password      | `verifier`               |

### CORS Configuration

| Variable              | Description                     | Default |
| --------------------- | ------------------------------- | ------- |
| `CORS_ORIGINS`        | Allowed origins for CORS        | `*`     |
| `CORS_ORIGINPATTERNS` | Origin patterns for CORS        | `*`     |
| `CORS_METHODS`        | Allowed HTTP methods            | `*`     |
| `CORS_HEADERS`        | Allowed headers                 | `*`     |
| `CORS_CREDENTIALS`    | Allow credentials               | `false` |
| `CORS_MAXAGE`         | Pre-flight cache time (seconds) | `3600`  |

### Trust Sources Configuration

Configure multiple trust sources for credential issuer validation:

```bash
# Trust Source 0
VERIFIER_TRUSTSOURCES_0_PATTERN=eu.europa.ec.eudi.pid.*
VERIFIER_TRUSTSOURCES_0_KEYSTORE_PATH=classpath:trusted-issuers.jks
VERIFIER_TRUSTSOURCES_0_KEYSTORE_TYPE=jks

# Trust Source 1 (if needed)
VERIFIER_TRUSTSOURCES_1_PATTERN=urn:eu.europa.ec.eudi:pid:.*
VERIFIER_TRUSTSOURCES_1_LOTL_LOCATION=https://eudi.ec.europa.eu/trusted-lists
```

### Frontend Configuration (AV Verifier UI)

The AV Verifier UI requires environment configuration to connect to the backend:

#### Development Setup

Create a `.env` file in the `av-verifier-ui` directory:

```bash
# .env file for development
VITE_VERIFIER_BASE_URL=http://localhost:8080
```

#### Production Setup

For production deployment, update the backend URL:

```bash
# .env file for production
VITE_VERIFIER_BASE_URL=https://your-backend-domain.com
```

#### Environment Variables

| Variable                 | Description          | Example                 |
| ------------------------ | -------------------- | ----------------------- |
| `VITE_VERIFIER_BASE_URL` | Backend API base URL | `http://localhost:8080` |

**Note**: The `VITE_` prefix is required for Vite to expose the variable to the frontend application.

## API Reference

### Core Endpoints

| Endpoint               | Method | Purpose                  | Example                                          |
| ---------------------- | ------ | ------------------------ | ------------------------------------------------ |
| `/actuator/health`     | GET    | Health check             | `curl http://localhost:8080/actuator/health`     |
| `/actuator`            | GET    | List available endpoints | `curl http://localhost:8080/actuator`            |
| `/public/openapi.json` | GET    | API documentation        | `curl http://localhost:8080/public/openapi.json` |
| `/swagger-ui`          | GET    | Interactive API docs     | Browser: `http://localhost:8080/swagger-ui`      |

### Verifier API Endpoints

#### Initialize Transaction

- **URL**: `POST /ui/presentations`
- **Purpose**: Initialize a new presentation transaction
- **Content-Type**: `application/json`

**Example Request:**

```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{
    "type": "vp_token",
    "presentation_definition": {
      "id": "age-verification",
      "input_descriptors": [
        {
          "id": "eu.europa.ec.agev10n",
          "format": {
            "mso_mdoc": {
              "alg": ["ES256"]
            }
          },
          "constraints": {
            "fields": [
              {
                "path": ["$['\''eu.europa.ec.agev10n'\'']['\''age_over_18'\'']"],
                "intent_to_retain": false
              }
            ]
          }
        }
      ]
    },
    "nonce": "nonce",
    "jar_mode": "by_reference"
  }' \
  http://localhost:8080/ui/presentations
```

#### Get Wallet Response

- **URL**: `GET /ui/presentations/{transactionId}?response_code={responseCode}`
- **Purpose**: Retrieve wallet response for a transaction

**Example:**

```bash
curl "http://localhost:8080/ui/presentations/{transactionId}?response_code={responseCode}"
```

### Wallet API Endpoints

#### Get Authorization Request

- **URL**: `GET /wallet/request.jwt/{requestId}`
- **Purpose**: Retrieve authorization request by reference

#### Get Presentation Definition

- **URL**: `GET /wallet/pd/{requestId}`
- **Purpose**: Retrieve presentation definition by reference

#### Send Wallet Response

- **URL**: `POST /wallet/direct_post`
- **Purpose**: Receive wallet response via direct post

### Utility Endpoints

#### Validate MSO MDoc DeviceResponse

- **URL**: `POST /utilities/validations/msoMdoc/deviceResponse`
- **Purpose**: Validate MSO MDoc DeviceResponse

## Deployment Options

### Option 1: Local Development (Recommended)

**Pros:**

- Fast development cycle
- Easy debugging
- Direct access to logs

**Setup:**

```bash
# Terminal 1: Backend
cd eudi-srv-web-verifier-endpoint-23220-4-kt
./gradlew bootRun

# Terminal 2: Frontend
cd av-verifier-ui
npm run dev
```

### Option 2: Docker Compose

**Setup:**

```bash
# Navigate to docker directory
cd eudi-srv-web-verifier-endpoint-23220-4-kt/docker

# Start services
docker-compose up -d

# Stop services
docker-compose down
```

**Services:**

- `verifier`: Backend service
- `verifier-ui`: Official EUDI UI (optional)
- `haproxy`: Reverse proxy with SSL termination

### Option 3: Production Deployment

**Build Docker Image:**

```bash
./gradlew bootBuildImage
```

**Environment Variables for Production:**

```bash
export VERIFIER_PUBLICURL="https://your-domain.com"
export VERIFIER_RESPONSE_MODE="DirectPostJwt"
export VERIFIER_JAR_SIGNING_KEY="LoadFromKeystore"
export VERIFIER_JAR_SIGNING_KEY_KEYSTORE="file:///keystore.jks"
export SPRING_PROFILES_ACTIVE="san-dns"
```

## Security Considerations

### HTTPS Requirement

- Both APIs need to be exposed over HTTPS
- Verifier API needs to be protected for authorized access only
- Current version is a development tool, not production-ready

### Keystore Management

```bash
# Verify keystore configuration
keytool -list -keystore src/main/resources/keystore.jks

# Check trusted issuers
keytool -list -keystore src/main/resources/trusted-issuers.jks
```

### CORS Configuration

The backend is configured to allow requests from the AV Verifier UI:

```properties
cors.origins=http://localhost:5173
cors.credentials=false
cors.maxAge=3600
```
