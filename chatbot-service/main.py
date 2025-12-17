import os
import json
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- Configuration ---
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
MODEL_NAME = "openai/gpt-oss-120b:free"
API_GATEWAY_URL = "http://localhost:3001" 

# --- Tool Definition ---
TOOLS = [
    {
        "name": "get_mobility_lines",
        "description": "Get information about public transport lines like bus, metro, or tram.",
        "parameters": {
            "type": "object",
            "properties": {
                "line_type": {"type": "string", "description": "e.g., 'Bus', 'Metro', 'Tram'"},
                "status": {"type": "string", "description": "e.g., 'Delayed', 'On Time'"}
            },
            "required": [],
        },
    },
    {
        "name": "get_air_quality",
        "description": "Get the latest air quality index (AQI) for a named city zone.",
        "parameters": {
            "type": "object",
            "properties": {
                "zone_name": {"type": "string", "description": "The name of the zone, e.g., 'Tunis Center', 'Charguia'."},
            },
            "required": ["zone_name"],
        },
    },
    {
        "name": "get_emergency_alerts",
        "description": "Get emergency alerts for a specific zone in the city.",
        "parameters": {
            "type": "object",
            "properties": {
                "zone": {"type": "string", "description": "The zone to check for alerts, e.g., 'Downtown', 'Old City'."}
            },
            "required": ["zone"],
        },
    },
    {
        "name": "query_city_info",
        "description": "Get general city info (points of interest, events, etc.) using GraphQL. When querying for an object like 'category' or 'zone', you must specify which sub-fields you want, for example: 'pointsOfInterest { name category { name } }'.",
        "parameters": {"type": "object", "properties": {"query": {"type": "string", "description": "A valid GraphQL query string. For example: '{ pointsOfInterest { name category { name } } }'"}}, "required": ["query"]},
    }
]

# --- System Prompt ---
SYSTEM_PROMPT = f"""You are a helpful city services assistant. Your goal is to provide information to citizens by using the available tools. When a user asks a question, determine if you can answer it by calling one of the tools. If a tool is needed, do not answer directly. Instead, respond ONLY with a single JSON object to call the tool, like this: {{"tool": "tool_name", "params": {{...}}}}. If no tool is needed, answer in a friendly, conversational manner.

Here are the tools available to you:
{json.dumps(TOOLS, indent=2)}
"""

# --- FastAPI App & OpenAI Client ---
app = FastAPI(title="Chatbot Service")
if not OPENROUTER_API_KEY:
    raise RuntimeError("OPENROUTER_API_KEY not set.")
client = OpenAI(base_url=OPENROUTER_BASE_URL, api_key=OPENROUTER_API_KEY)

# --- Pydantic Models ---
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

# --- Tool Execution Logic ---
def execute_tool_call(tool_name: str, params: dict):
    """Dynamically calls the appropriate function based on the tool name."""
    if tool_name == "get_mobility_lines":
        try:
            url = f"{API_GATEWAY_URL}/mobility/lines"
            print(f"Calling Mobility service at {url} with params {params}")
            response = requests.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return f"Error calling Mobility service: {e}"
    
    elif tool_name == "get_air_quality":
        try:
            zone_name = params.get("zone_name")
            if not zone_name:
                return "Error: 'zone_name' parameter is required for get_air_quality."
            url = f"{API_GATEWAY_URL}/air-quality/zones/{zone_name}"
            print(f"Calling Air Quality service at {url}")
            response = requests.get(url)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return f"Error calling Air Quality service: {e}"

    elif tool_name == "get_emergency_alerts":
        try:
            zone = params.get("zone")
            if not zone:
                return "Error: 'zone' parameter is required for get_emergency_alerts."
            url = f"{API_GATEWAY_URL}/emergency/alerts/zone/{zone}"
            print(f"Calling Emergency service at {url}")
            response = requests.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return f"Error calling Emergency service: {e}"

    elif tool_name == "query_city_info":
        try:
            query = params.get("query")
            if not query:
                return "Error: 'query' parameter is required for query_city_info."
            url = f"{API_GATEWAY_URL}/graphql"
            print(f"Calling GraphQL service at {url} with query: {query}")
            response = requests.post(url, json={"query": query})
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return f"Error calling GraphQL service: {e}"
            
    else:
        return f"Error: Unknown tool '{tool_name}'."

def extract_json_from_string(text: str):
    """Finds and parses the first valid JSON object from a string."""
    try:
        # Find the first '{' and the last '}' in the string
        start_index = text.find('{')
        end_index = text.rfind('}') + 1
        
        # If both are found, slice and parse
        if start_index != -1 and end_index != 0:
            json_str = text[start_index:end_index]
            return json.loads(json_str)
            
    except (json.JSONDecodeError, IndexError):
        # If parsing fails or indices are wrong, return None
        return None
        
    return None

# --- API Endpoints ---
@app.get("/")
def read_root():
    return {"message": "Chatbot Service is running."}

@app.post("/chat", response_model=ChatResponse)
async def chat_with_model(request: ChatRequest):
    messages = [{"role": "system", "content": SYSTEM_PROMPT}, {"role": "user", "content": request.message}]
    
    try:
        response = client.chat.completions.create(model=MODEL_NAME, messages=messages, extra_body={"reasoning": {"enabled": True}})
        assistant_message = response.choices[0].message
        messages.append(assistant_message)

        tool_call = None
        content_str = assistant_message.content.strip()
        potential_tool_call = extract_json_from_string(content_str)
        
        if potential_tool_call and 'tool' in potential_tool_call and 'params' in potential_tool_call:
            tool_call = potential_tool_call

        if tool_call:
            tool_name = tool_call.get("tool")
            tool_params = tool_call.get("params")
            
            tool_result = execute_tool_call(tool_name, tool_params)
            
            messages.append({"role": "tool", "content": json.dumps(tool_result)})
            
            final_response = client.chat.completions.create(model=MODEL_NAME, messages=messages)
            final_reply = final_response.choices[0].message.content
            return ChatResponse(reply=final_reply)

        return ChatResponse(reply=assistant_message.content)

    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail="Failed to get a response from the AI model.")

