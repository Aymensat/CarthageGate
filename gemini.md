This file contains important context for the CarthageGate project.

**Project Description:** See `Project_descprion.txt`.
**Service Documentation:** All backend service contracts (WSDL, OpenAPI, .proto, GraphQL schema) are located in `Mocked data & documentation/`.

---

### **Project Status (as of 2025-12-16)**

1.  **Core Services:** The four main microservices (REST, SOAP, gRPC, GraphQL) and the API Gateway are complete and containerized.
2.  **Web Client:** A React+TypeScript web client (`./web-client`) has been developed to display data from all services.
3.  **Chatbot Service:** A new Python-based chatbot microservice (`./chatbot-service`) has been created and its core logic is complete. It can successfully use "tools" to call all four core services via the API gateway to answer user questions.
4.  **Overall Status:** The backend for the chatbot is complete. The next major task is to integrate this service into the frontend UI and finalize the Docker configuration.

---

### **Development Notes & Key Learnings (IMPORTANT FOR FUTURE WORK)**

To avoid repeating past errors, please adhere to the following:

#### **1. Frontend (`./web-client`)**

*   **Styling & Build:** The existing Vite + Tailwind CSS v3 setup is stable. **Do not change this setup unless absolutely necessary.** (See original notes below for details on past issues).
*   **API Communication:** All API calls must be prefixed with `/api` which is handled by the Vite proxy (dev) and Nginx (prod).

#### **2. Backend & Data**

*   **ALWAYS READ THE DOCUMENTATION:** This principle remains critical.
*   **Rebuilding Containers:** Remember to use `docker-compose up --build -d <service_name>` if you modify source code inside a Docker image.

---

### **Task: Chatbot Microservice (Backend - COMPLETE)**

The initial goal of creating a tool-calling chatbot microservice is complete. Here is a detailed summary of the implementation for future reference.

#### **A. Service Overview**

*   **Directory:** `chatbot-service/`
*   **Language/Framework:** Python with FastAPI.
*   **Dependencies:** `fastapi`, `uvicorn`, `openai`, `python-dotenv`, `requests`.
*   **Purpose:** To act as a conversational AI agent that can call the other four microservices to answer user questions.

#### **B. Architecture & Key Learnings**

*   **Gateway is King (Protocol Translation):** A critical learning was that the chatbot service **does not need protocol-specific clients** (like SOAP or gRPC clients). The `api-gateway` handles protocol translation, exposing all backend services as simple REST-like endpoints. The chatbot only needs the `requests` library to communicate with the gateway.
*   **Tool-Calling Endpoints:** The chatbot's tools are mapped to the following gateway endpoints:
    *   `get_mobility_lines` -> `GET /mobility/lines`
    *   `get_air_quality` -> `GET /air-quality/zones/:zone_name`
    *   `get_emergency_alerts` -> `GET /emergency/alerts/zone/:zone`
    *   `query_city_info` -> `POST /graphql`
*   **LLM Logic (Two-Step Tool Call):** The chat logic in `main.py` follows a two-step process:
    1.  **Step 1 (Detection):** Send the user's query and the tool definitions (from the `SYSTEM_PROMPT`) to the LLM. The LLM's response is checked for a JSON tool call.
    2.  **Step 2 (Execution & Summary):** If a tool call is detected, the Python code executes it by calling the appropriate gateway endpoint. The result from the gateway is then added to the conversation history and sent back to the LLM in a *second* API call. The LLM's final response from this second call is the natural-language summary shown to the user.
*   **Robust JSON Parsing:** The model's JSON output can be inconsistent (e.g., wrapped in markdown). The `extract_json_from_string` function in `main.py` was specifically implemented to be robust. It finds the first `{` and last `}` in the response string to reliably extract the JSON payload. **Do not revert to a simple `startswith/endswith` check.**
*   **Service Limitations:**
    *   The `get_emergency_alerts` tool requires a `zone` because the underlying gRPC service does not have a method to fetch all alerts from all zones. This is a known limitation of the backend.
    *   The service does not currently support "chained" tool calls (i.e., using the output of one tool as the input for another in a single turn).

#### **C. Local Development Workflow**

This service was developed and tested locally before Dockerization. This is the recommended workflow for future changes.

1.  **Run Dependencies:** Start the other microservices first: `docker-compose up -d`.
2.  **Setup Environment:**
    *   Navigate to the service directory: `cd chatbot-service`
    *   Create a virtual environment: `python -m venv venv`
    *   Activate it: `.\venv\Scripts\Activate.ps1` (for PowerShell)
    *   Install packages: `pip install -r requirements.txt`
3.  **API Key:** Create a `chatbot-service/.env` file and place the `OPENROUTER_API_KEY` in it.
4.  **Run Server:** `uvicorn main:app --reload`. The server runs on `http://127.0.0.1:8000`.
5.  **Configuration Note:** The `API_GATEWAY_URL` in `main.py` is hardcoded to `http://localhost:3001` for this local workflow. This **must be changed** for the final Docker deployment.

---

### **Next Task: Frontend Integration & Final Deployment**

The backend is complete. The goal now is to connect it to the React UI and prepare for final deployment.

1.  **Implement Chat UI:**
    *   The UI entry point is the "Chat with AI" button in `./web-client/src/components/ChatbotPlaceholder.tsx`.
    *   Replace the placeholder with a functional chat interface (input box, send button, message display area).
    *   Connect the UI to the backend by making API calls to the `/api/chat` endpoint.

2.  **Add Markdown Rendering:**
    *   The LLM frequently returns responses with Markdown formatting (newlines for paragraphs, `|` for tables).
    *   Install a Markdown rendering library (e.g., `react-markdown`) in the `./web-client` project.
    *   Use this library to render the chatbot's message content so that formatting is displayed correctly.

3.  **Final Dockerization:**
    *   **Update Chatbot Config:** In `chatbot-service/main.py`, change the `API_GATEWAY_URL` variable from `http://localhost:3001` to `http://api-gateway:3001`.
    *   **Update Docker Compose:** Add the `chatbot-service` back into the main `docker-compose.yml` file and ensure the `api-gateway` `depends_on` list includes it.
    *   **Build & Run:** Use `docker-compose up --build -d` to build the new chatbot image and run the entire integrated application stack.

---
*Original Notes from 2025-12-14 are preserved below for historical context.*
---

<details>
<summary>Legacy Development Notes (pre-chatbot)</summary>

This file contains important context for the CarthageGate project.

**Project Description:** See `Project_descprion.txt`.
**Service Documentation:** All backend service contracts (WSDL, OpenAPI, .proto, GraphQL schema) are located in `Mocked data & documentation/`.

---

##### **Project Status (as of 2025-12-14)**

1.  **Core Services:** The four main microservices (REST, SOAP, gRPC, GraphQL) and the API Gateway are complete, containerized, and confirmed to be working via `docker-compose`.
2.  **Web Client:** A React+TypeScript web client (`./web-client`) has been developed to display data from all services. It is also fully containerized and integrated into the main `docker-compose.yml`.
3.  **Overall Status:** The initial project requirements are fulfilled. The next major task is to implement a new chatbot microservice.

---

##### **Development Notes & Key Learnings (IMPORTANT FOR FUTURE WORK)**

To avoid repeating past errors, please adhere to the following:

###### **1. Frontend (`./web-client`)**

*   **Styling:** The project uses **Tailwind CSS v3**. The initial attempts with v4 and various Vite plugin configurations failed. The final, working setup uses `tailwindcss@^3.0.0` with `postcss` and `autoprefixer`. The configuration is handled by `postcss.config.cjs` and `tailwind.config.cjs`. **Do not change this setup unless absolutely necessary.**
*   **Build System:** The project uses Vite. Several build errors were encountered.
    *   **JSX Errors (`--jsx` is not set):** This was caused by accidentally removing `"jsx": "react-jsx"` from `tsconfig.app.json`. Do not remove this property.
    *   **Enum Export Errors (`TS1294`):** The build failed due to strict TypeScript rules (`verbatimModuleSyntax` and `erasableSyntaxOnly`) conflicting with `export enum`. The fix was to **remove these two flags** from `tsconfig.app.json`, not to change the code. The `export enum` syntax is confirmed to work in both dev and prod builds with this fix.
*   **API Communication:**
    *   **Dev Environment:** The Vite dev server (`npm run dev`) uses a proxy defined in `vite.config.ts`. All API calls must be prefixed with `/api` (e.g., `/api/mobility/lines`).
    *   **Production (Docker):** The production container uses **Nginx as a reverse proxy**. The configuration in `nginx.conf` also forwards all `/api` requests to the `api-gateway` service. This architecture is working correctly. **Do not make API calls directly to `localhost:3001` from the frontend code.**

###### **2. Backend & Data**

*   **ALWAYS READ THE DOCUMENTATION:** Several errors were caused by making assumptions about API endpoints and data models. The canonical source of truth for all services is the documentation in `Mocked data & documentation/` and the backend source code itself.
    *   *Example:* The mobility service endpoint was `/api/lines`, not `/api/transport-lines`. The data model used `lineType` and `lineStatus`, not `type` and `status`. Verify these details before writing client code.
*   **Rebuilding Containers:** If you modify source code that is copied into a Docker image (like the mock data in `graphql-service/src/data/mockData.js`), you **must rebuild the container image** for the changes to take effect. A simple `docker-compose restart` is not enough. Use `docker-compose up --build -d <service_name>`.
---

###### **Original Next Task: Chatbot Microservice**

The goal is to add a new chatbot microservice that integrates with the existing system.

*   **Frontend Integration:** The UI entry point is the "Chat with AI" button (`./web-client/src/components/ChatbotPlaceholder.tsx`). This should be made functional to open a chat interface.
*   **Backend Requirement:** Create a new microservice (e.g., in Node.js/Python).
*   **Gateway Integration:** Add a new route in the `./api-gateway` to direct requests from the web client to the new chatbot microservice.
*   **Core Functionality ("Tool Calling"):** The chatbot's primary purpose is to act as an intelligent agent over the existing city services. It should be able to answer natural language queries by calling the other microservices.
    *   *Example Query:* "Are there any delays on the Metro?"
    *   *Expected Action:* The chatbot service should receive this, understand the intent, and make a request to the Mobility (REST) service via the API Gateway to get the status of metro lines, then formulate a natural language response.
    *   This implies the chatbot service will need its own set of clients (REST, SOAP, gRPC, GraphQL) to communicate with the gateway.
</details>

