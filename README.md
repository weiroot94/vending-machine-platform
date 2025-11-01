# Vending Machine Platform

An end-to-end vending machine management stack that combines a Node.js/Express API, a MongoDB persistence layer, real-time WebSocket communication, and two React applications. The `VMAdmin` app gives operators a control center for machines, inventory, orders, analytics, and multilingual content. The `VMCustomer` app powers machine-facing or consumer kiosks with product browsing, purchases, deposits, and PayPal or card payments. A dedicated API (`Server`) mediates device connectivity, user authentication, notifications, and asset delivery.

## Repository Structure
- `Server/` – HTTPS REST API, WebSocket gateway, and background services (Express, Mongoose, Nodemailer, PayPal, Google OAuth).
- `VMAdmin/` – Admin dashboard (React 18 + CRA) for managing machines, inventory, adverts, orders, users, and translations.
- `VMCustomer/` – Customer-facing storefront/kiosk (React 18 + CRA + Fuse template) with payments, multilingual UI, and QR flows.
- `mongodb/vmdb/` – BSON dump for bootstrapping the MongoDB database with sample data.
- `certsFiles/` & `Server/certsFiles/` – expected location for TLS key/certificate pairs used by the HTTPS server.

## Core Capabilities
- Role-based authentication with JWT tokens, optional Google OAuth, and hashed credentials.
- Machine onboarding and licensing, remote status polling, and asset synchronization through REST and WebSocket channels.
- Inventory, product, pricing, advertisement, language, and order management, including audit trails and analytics endpoints.
- Customer wallet deposits via PayPal REST APIs or stored card information, with transaction persistence.
- Email notifications (unlock, password reset, verification) with custom HTML templates.
- Media and document uploads for ads, product imagery, and localized content served from `Server/upload`.

## Technology Stack
- Backend: Node.js, Express, Mongoose/MongoDB, WebSocket (`ws`), Nodemailer, Winston logging.
- Frontend: React 18, React Router, MUI, Bootstrap, Fuse React (customer portal), SCSS.
- Tooling: Nodemon, concurrently, CRA build pipeline, i18next, PayPal REST SDK usage.

## Prerequisites
- Node.js 18 LTS or newer (aligns with CRA and MongoDB driver requirements).
- npm 9+ (ships with Node 18).
- MongoDB 6.x+ running locally or accessible remotely.
- OpenSSL (or similar) for creating development TLS certificates.
- Git, PowerShell/Bash, and optionally `mongorestore` (included with MongoDB tools).

## Backend Setup (`Server/`)
1. **Install dependencies**
   ```bash
   cd Server
   npm install
   ```
2. **Configure environment**
   - Copy `Server/config/index.local.example.json` to `Server/config/index.local.json` and replace the placeholder secrets (`dbUri`, `jwtSecret`, `qrSecret`, `email`, `customerURL`, `git*`, `googleclientid`) with your own values. The `.local` file is ignored by Git so you can safely keep real credentials out of version control.
   - Create `Server/.env` for sensitive runtime variables (values shown as examples only):
     ```dotenv
     PORT=8443
     HOST=localhost
     WSPORT=8081
     PAYPAL_CLIENT_ID=your-paypal-client-id
     PAYPAL_CLIENT_SECRET=your-paypal-client-secret
     GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
     ```
     Add any other secrets you prefer to inject at runtime (e.g., overriding email credentials) and update the code/config accordingly.
3. **TLS certificates**
   - Place a private key (`priv.key`) and certificate (`cert.crt`) under `Server/certsFiles/`.
   - For local development, you can generate a self-signed pair:
     ```bash
     openssl req -x509 -nodes -days 365 \
       -newkey rsa:2048 \
       -keyout Server/certsFiles/priv.key \
       -out Server/certsFiles/cert.crt
     ```
   - If HTTPS is not required in your environment, you can adapt `Server/index.js` to use HTTP only.
4. **Restore sample data (optional)**
   ```bash
   mongorestore --nsInclude=vmdb.* --dir "../mongodb/vmdb"
   ```
   Ensure the `dbUri` in `config/index.local.json` (or `DB_URI` environment variable) points to the database you just populated.
5. **Run the API**
   ```bash
   npm run start
   ```
   The server listens on `https://HOST:PORT` (default `https://localhost:8443`) and opens a WebSocket server on `WSPORT` (default `8081`).

### Notable Backend Endpoints & Services
- `/auth`, `/api`, `/client`, `/customer`, `/file`, `/token` – main REST entry points (see `Server/server/routes`).
- WebSocket actions (see `Server/server/ws/constants.js` & `eventHandler.js`) support machine connections, status updates, and admin broadcasts.
- PayPal integration in `PayPalController.js` requires sandbox/production credentials from `.env`.
- Google OAuth handled in `GoogleController.js` (needs both config `googleclientid` and `.env` secret).
- HTML email templates live in `Server/emailTemplates/` and can be customized per brand.

## Admin Portal (`VMAdmin/`)
1. **Install dependencies**
   ```bash
   cd VMAdmin
   npm install
   ```
2. **Point to the API**
   Create `.env.local` (or `.env`) and set:
   ```dotenv
   REACT_APP_SERVER_URL=https://localhost:8443
   REACT_APP_GOOGLE_MAP_API_KEY=your-browser-google-maps-key
   ```
   Use your deployed API URL (and production Google Maps key) in production.
3. **Run locally**
   ```bash
   npm start
   ```
   The app runs at `http://localhost:3000` by default.
4. **Build for deployment**
   ```bash
   npm run build
   ```
   Builds output to `../built/admin` (as configured in `package.json`). Serve the static bundle behind your preferred web server or CDN.

The admin app authenticates via the `/auth` endpoints, consumes analytics data, manages machines/products/orders, configures translations, uploads media, and displays real-time machine status via WebSockets.

## Customer Portal (`VMCustomer/`)
1. **Install dependencies**
   ```bash
   cd VMCustomer
   npm install
   ```
2. **Configure runtime URLs & keys**
   Create `.env.local` (or `.env`) and set:
   ```dotenv
   REACT_APP_API_SERVER=https://localhost:8443/
   REACT_APP_PAYPAL_CLIENT_ID=your-paypal-client-id
   REACT_APP_PAYPAL_MERCHANT_ID=your-paypal-merchant-id
   REACT_APP_PAYPAL_SECRET=your-paypal-secret
   REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
   REACT_APP_GOOGLE_MAP_API_KEY=your-browser-google-maps-key
   ```
3. **Run locally**
   ```bash
   npm start
   ```
   CRA serves the app at `http://localhost:3000` (or the next free port if the admin app is already running).
4. **Build for deployment**
   ```bash
   npm run build
   ```
   The optimized bundle is emitted to `../built/static`.

The customer app supports QR-code flows, multilingual content, product browsing, wallet deposits, and order tracking. It talks to the same API endpoints as the admin app but exposes customer-specific routes, Fuse React components, and PayPal checkout integrations.

## Sample Data & Assets
- MongoDB dump under `mongodb/vmdb` seeds example machines, products, users, languages, orders, and sales for experimentation.
- Static assets (ads, info screens, language flags, product imagery) reside under `Server/upload/` and both React apps' `public`/`assets` folders.
- Email templates in `Server/emailTemplates/` illustrate the expected merge variables and markup for notifications.

## Logging & Monitoring
- Backend logging is handled via Winston (`Server/server/logger`). Adjust transports to match your environment.
- API rate limiting is configured through `Server/server/middleware/apiRateLimit.js` (tweak thresholds as needed).
- Audit trails are persisted in MongoDB through `AuditController` and surfaced in admin dashboards.

## Testing & Quality
- The React apps include the default CRA testing setup (`npm test`).
- No automated backend test suite is provided; consider adding Jest or another framework for regression coverage.
- Ensure linting/formatting rules meet your standards before integrating into CI/CD.

## Deployment Considerations
- Replace development TLS certificates with valid certificates in production.
- Externalize all secrets (`config/index.local.json`, `.env`, PayPal/Google keys) via your secret management solution.
- The admin and customer builds (`built/admin`, `built/static`) can be served by any static hosting solution; ensure they proxy API calls to the deployed `Server` instance over HTTPS.
- Configure CORS in `Server/index.js` with an allowlist before exposing the API publicly.

## Maintaining the Project
- Keep Node.js and npm versions aligned across all packages to avoid dependency conflicts.
- Update MongoDB URIs, indexes, and schema migrations whenever models change (see `Server/server/models`).
- Review WebSocket event handling (`Server/server/ws`) when adding new machine actions.
- Expand `.env` and config documentation to match new integrations (payment providers, telemetry, etc.).

---

Happy vending! Customize the stack to match your hardware integration, payment flows, and branding requirements.

