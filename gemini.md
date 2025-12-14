This file contains important context for the CarthageGate project.

**Project Description:** See `Project_descprion.txt`.
**Service Documentation:** All backend service contracts (WSDL, OpenAPI, .proto, GraphQL schema) are located in `Mocked data & documentation/`.

---

### **Project Status (as of 2025-12-14)**

1.  **Core Services:** The four main microservices (REST, SOAP, gRPC, GraphQL) and the API Gateway are complete, containerized, and confirmed to be working via `docker-compose`.
2.  **Web Client:** A React+TypeScript web client (`./web-client`) has been developed to display data from all services. It is also fully containerized and integrated into the main `docker-compose.yml`.
3.  **Overall Status:** The initial project requirements are fulfilled. The next major task is to implement a new chatbot microservice.

---

### **Development Notes & Key Learnings (IMPORTANT FOR FUTURE WORK)**

To avoid repeating past errors, please adhere to the following:

#### **1. Frontend (`./web-client`)**

*   **Styling:** The project uses **Tailwind CSS v3**. The initial attempts with v4 and various Vite plugin configurations failed. The final, working setup uses `tailwindcss@^3.0.0` with `postcss` and `autoprefixer`. The configuration is handled by `postcss.config.cjs` and `tailwind.config.cjs`. **Do not change this setup unless absolutely necessary.**
*   **Build System:** The project uses Vite. Several build errors were encountered.
    *   **JSX Errors (`--jsx` is not set):** This was caused by accidentally removing `"jsx": "react-jsx"` from `tsconfig.app.json`. Do not remove this property.
    *   **Enum Export Errors (`TS1294`):** The build failed due to strict TypeScript rules (`verbatimModuleSyntax` and `erasableSyntaxOnly`) conflicting with `export enum`. The fix was to **remove these two flags** from `tsconfig.app.json`, not to change the code. The `export enum` syntax is confirmed to work in both dev and prod builds with this fix.
*   **API Communication:**
    *   **Dev Environment:** The Vite dev server (`npm run dev`) uses a proxy defined in `vite.config.ts`. All API calls must be prefixed with `/api` (e.g., `/api/mobility/lines`).
    *   **Production (Docker):** The production container uses **Nginx as a reverse proxy**. The configuration in `nginx.conf` also forwards all `/api` requests to the `api-gateway` service. This architecture is working correctly. **Do not make API calls directly to `localhost:3001` from the frontend code.**

#### **2. Backend & Data**

*   **ALWAYS READ THE DOCUMENTATION:** Several errors were caused by making assumptions about API endpoints and data models. The canonical source of truth for all services is the documentation in `Mocked data & documentation/` and the backend source code itself.
    *   *Example:* The mobility service endpoint was `/api/lines`, not `/api/transport-lines`. The data model used `lineType` and `lineStatus`, not `type` and `status`. Verify these details before writing client code.
*   **Rebuilding Containers:** If you modify source code that is copied into a Docker image (like the mock data in `graphql-service/src/data/mockData.js`), you **must rebuild the container image** for the changes to take effect. A simple `docker-compose restart` is not enough. Use `docker-compose up --build -d <service_name>`.

---

### **Next Task: Chatbot Microservice**

The goal is to add a new chatbot microservice that integrates with the existing system.

*   **Frontend Integration:** The UI entry point is the "Chat with AI" button (`./web-client/src/components/ChatbotPlaceholder.tsx`). This should be made functional to open a chat interface.
*   **Backend Requirement:** Create a new microservice (e.g., in Node.js/Python).
*   **Gateway Integration:** Add a new route in the `./api-gateway` to direct requests from the web client to the new chatbot microservice.
*   **Core Functionality ("Tool Calling"):** The chatbot's primary purpose is to act as an intelligent agent over the existing city services. It should be able to answer natural language queries by calling the other microservices.
    *   *Example Query:* "Are there any delays on the Metro?"
    *   *Expected Action:* The chatbot service should receive this, understand the intent, and make a request to the Mobility (REST) service via the API Gateway to get the status of metro lines, then formulate a natural language response.
    *   This implies the chatbot service will need its own set of clients (REST, SOAP, gRPC, GraphQL) to communicate with the gateway.

