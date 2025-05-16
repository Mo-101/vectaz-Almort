import requests
import yaml # For handling YAML in train/test requests
import json
import os
import logging
from typing import Dict, List, Any, Optional, Tuple, Union

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# --- Configuration ---
DEEPCAL_BASE_URL = os.environ.get('DEEPCAL_BASE_URL', "http://localhost:8080")
API_TOKEN = os.environ.get('DEEPCAL_API_TOKEN', "your_api_token_here")  # If using TokenAuth (configure DeepCAL with --auth-token)
# Logger for this module
logger = logging.getLogger('deeptalk_agent')

# Voice system configuration that will be connected on the TS/JS side
VOICE_ENABLED = True

class DeepCALAgent:
    def __init__(self, base_url=DEEPCAL_BASE_URL, token=API_TOKEN, jwt_token=None):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        self.token = token
        self.jwt_token = jwt_token

        # Set up authentication
        if self.jwt_token:
            self.session.headers.update({"Authorization": f"Bearer {self.jwt_token}"})
        # TokenAuth is usually handled per-request via query params,
        # but can be added to session.params if always needed.
        # For this example, we'll add it in _request if not using JWT.

    def _request(self, method, endpoint, params=None, data=None, json_data=None, files=None, headers=None, content_type=None):
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        
        req_params = params.copy() if params else {}
        req_headers = headers.copy() if headers else {}

        if not self.jwt_token and self.token: # Use TokenAuth if no JWT and token is provided
            req_params['token'] = self.token

        if content_type:
            req_headers['Content-Type'] = content_type
            
        try:
            response = self.session.request(
                method, url, params=req_params, data=data, json=json_data, files=files, headers=req_headers
            )
            response.raise_for_status() # Raises HTTPError for bad responses (4XX or 5XX)

            # Handle different response types
            if response.status_code == 204: # No Content
                return None
            if 'application/json' in response.headers.get('Content-Type', ''):
                return response.json()
            if 'text/plain' in response.headers.get('Content-Type', ''):
                return response.text
            if 'application/octet-stream' in response.headers.get('Content-Type', ''):
                # For binary files like trained models
                filename = response.headers.get('filename', 'model.tar.gz')
                return response.content, filename
            if 'text/yml' in response.headers.get('Content-Type', '') or \
               'application/x-yaml' in response.headers.get('Content-Type', ''):
                return response.text # YAML as text, parse upstream if needed
            
            return response.content # Fallback for other types

        except requests.exceptions.HTTPError as e:
            logger.error(f"HTTP Error: {e.response.status_code} for {url}")
            try:
                error_details = e.response.json()
                logger.error(f"Error details: {error_details}") # APIs often return JSON errors
                return {"error": True, "status_code": e.response.status_code, "details": error_details}
            except json.JSONDecodeError:
                error_text = e.response.text
                logger.error(f"Error details (text): {error_text}")
                return {"error": True, "status_code": e.response.status_code, "message": error_text}
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Request Exception: {e} for {url}")
            return {"error": True, "message": str(e), "type": "connection"}

    # --- Server Information ---
    def get_health(self):
        """GET /Status - Health endpoint."""
        return self._request("GET", "/Status")

    def get_license(self):
        """GET /license - DeepCAL Pro License Information."""
        return self._request("GET", "/license")

    def get_version(self):
        """GET /version - Version of DeepCAL."""
        return self._request("GET", "/version")

    def get_server_status(self):
        """GET /status - DeepCAL Server Status (authenticated)."""
        return self._request("GET", "/status")

    # --- Tracker ---
    def get_conversation_tracker(self, conversation_id, include_events="AFTER_RESTART", until=None):
        """GET /conversations/{conversation_id}/tracker"""
        params = {"include_events": include_events}
        if until:
            params["until"] = until
        return self._request("GET", f"/conversations/{conversation_id}/tracker", params=params)

    def add_conversation_tracker_events(self, conversation_id, events, 
                                        include_events="AFTER_RESTART", output_channel=None, 
                                        execute_side_effects=False):
        """POST /conversations/{conversation_id}/tracker/events"""
        params = {"include_events": include_events, "execute_side_effects": execute_side_effects}
        if output_channel:
            params["output_channel"] = output_channel
        # `events` can be a single event dict or a list of event dicts
        return self._request("POST", f"/conversations/{conversation_id}/tracker/events", json_data=events, params=params)

    def replace_conversation_tracker_events(self, conversation_id, events_list, include_events="AFTER_RESTART"):
        """PUT /conversations/{conversation_id}/tracker/events"""
        params = {"include_events": include_events}
        return self._request("PUT", f"/conversations/{conversation_id}/tracker/events", json_data=events_list, params=params)

    def get_conversation_story(self, conversation_id, until=None, all_sessions=False):
        """GET /conversations/{conversation_id}/story"""
        params = {"all_sessions": all_sessions}
        if until:
            params["until"] = until
        return self._request("GET", f"/conversations/{conversation_id}/story", params=params)

    def trigger_conversation_intent(self, conversation_id, intent_name, entities=None,
                                   include_events="AFTER_RESTART", output_channel=None):
        """POST /conversations/{conversation_id}/trigger_intent"""
        payload = {"name": intent_name}
        if entities:
            payload["entities"] = entities
        params = {"include_events": include_events}
        if output_channel:
            params["output_channel"] = output_channel
        return self._request("POST", f"/conversations/{conversation_id}/trigger_intent", json_data=payload, params=params)

    def predict_conversation_action(self, conversation_id):
        """POST /conversations/{conversation_id}/predict"""
        return self._request("POST", f"/conversations/{conversation_id}/predict")

    def add_conversation_message(self, conversation_id, text, sender="user", parse_data=None,
                                 include_events="AFTER_RESTART"):
        """POST /conversations/{conversation_id}/messages"""
        payload = {"text": text, "sender": sender}
        if parse_data:
            payload["parse_data"] = parse_data
        params = {"include_events": include_events}
        return self._request("POST", f"/conversations/{conversation_id}/messages", json_data=payload, params=params)

    # --- Model ---
    def train_model(self, training_data_yaml, save_to_default_model_directory=True,
                    force_training=False, augmentation="50", num_threads="1", callback_url=None):
        """POST /model/train"""
        params = {
            "save_to_default_model_directory": save_to_default_model_directory,
            "force_training": force_training,
            "augmentation": augmentation,
            "num_threads": num_threads
        }
        if callback_url:
            params["callback_url"] = callback_url
        
        # training_data_yaml should be a YAML string
        return self._request("POST", "/model/train", data=training_data_yaml.encode('utf-8'), 
                             params=params, content_type="application/yaml")

    def test_model_stories(self, stories_yaml, e2e=False):
        """POST /model/test/stories"""
        params = {"e2e": e2e}
        return self._request("POST", "/model/test/stories", data=stories_yaml.encode('utf-8'), 
                             params=params, content_type="text/yml")
    
    def test_model_intent(self, nlu_data, model=None, callback_url=None, cross_validation_folds=None, is_json=False):
        """POST /model/test/intents"""
        params = {}
        if model: params["model"] = model
        if callback_url: params["callback_url"] = callback_url
        if cross_validation_folds: params["cross_validation_folds"] = cross_validation_folds

        content_type = "application/json" if is_json else "application/x-yaml"
        data_to_send = json.dumps(nlu_data) if is_json else nlu_data.encode('utf-8')
        
        return self._request("POST", "/model/test/intents", data=data_to_send, 
                             params=params, content_type=content_type)

    def predict_model_action(self, events_list, include_events="AFTER_RESTART"):
        """POST /model/predict"""
        params = {"include_events": include_events}
        return self._request("POST", "/model/predict", json_data=events_list, params=params)

    def parse_model_message(self, text, message_id=None, emulation_mode=None):
        """POST /model/parse"""
        payload = {"text": text}
        if message_id:
            payload["message_id"] = message_id
        params = {}
        if emulation_mode:
            params["emulation_mode"] = emulation_mode
        return self._request("POST", "/model/parse", json_data=payload, params=params)

    def replace_model(self, model_file_path=None, model_server_config=None, remote_storage=None):
        """PUT /model"""
        payload = {}
        if model_file_path:
            payload["model_file"] = model_file_path
        if model_server_config: #expects dict like {"url": "...", "params": {}}
            payload["model_server"] = model_server_config
        if remote_storage: # "aws", "gcs", "azure"
            payload["remote_storage"] = remote_storage
        
        if not payload:
            raise ValueError("At least one model source (model_file, model_server, remote_storage) must be provided.")
            
        return self._request("PUT", "/model", json_data=payload) # Expects 204 No Content on success

    def unload_model(self):
        """DELETE /model"""
        return self._request("DELETE", "/model") # Expects 204 No Content on success

    # --- Flows & Domain ---
    def get_flows(self):
        """GET /flows"""
        return self._request("GET", "/flows")

    def get_domain(self, as_yaml=False):
        """GET /domain"""
        headers = {"Accept": "application/yaml"} if as_yaml else {"Accept": "application/json"}
        return self._request("GET", "/domain", headers=headers)

    # --- Channel Webhooks (Simulating user sending a message) ---
    def send_message_rest_channel(self, sender_id, message, channel="rest"):
        """POST /webhooks/{rest_channel}/webhook"""
        # 'channel' can be 'rest' or 'callback'
        payload = {"sender": sender_id, "message": message}
        return self._request("POST", f"/webhooks/{channel}/webhook", json_data=payload)

    def send_message_custom_channel(self, channel_name, sender_id, message, 
                                    input_channel=None, metadata=None, stream=False):
        """POST /webhooks/{custom_channel}/webhook"""
        payload = {"sender": sender_id, "message": message, "stream": stream}
        if input_channel:
            payload["input_channel"] = input_channel
        if metadata:
            payload["metadata"] = metadata
        return self._request("POST", f"/webhooks/{channel_name}/webhook", json_data=payload)


if __name__ == '__main__':
    # Ensure your DeepCAL server is running on http://localhost:5005
    # and configure it with `--auth-token mysecrettoken` if API_TOKEN is set
    
    agent = DeepCALAgent(token="mysecrettoken") # or provide JWT
    
    # --- Example Usage ---
    try:
        print("--- DeepCAL Health ---")
        health = agent.get_health()
        print(health) # Expected: "Hello from DeepCAL: Freight Intelligence at 1.0.0"

        print("\n--- Server Version ---")
        version_info = agent.get_version()
        print(version_info)

        print("\n--- Server Status (Authenticated) ---")
        server_status = agent.get_server_status() # Needs auth
        print(server_status)

        # Simulate a user sending a message via REST webhook
        conversation_id = "test_user_123"
        print(f"\n--- Sending message to {conversation_id} via REST webhook ---")
        user_message = "Hello DeepCAL"
        responses = agent.send_message_rest_channel(sender_id=conversation_id, message=user_message)
        if responses:
            for resp in responses:
                print(f"DeepCAL responded: {resp.get('text')}")
        else:
            print("DeepCAL did not send an immediate response (might be an async action or no reply configured).")


        print(f"\n--- Getting tracker for {conversation_id} ---")
        tracker = agent.get_conversation_tracker(conversation_id)
        if tracker:
            print(f"Latest message in tracker: {tracker.get('latest_message', {}).get('text')}")
            print(f"Slots: {tracker.get('slots')}")
            # print(f"Full tracker: {json.dumps(tracker, indent=2)}")


        print(f"\n--- Parsing a message (NLU only) ---")
        parsed_nlu = agent.parse_model_message("I want to ship some goods to London")
        if parsed_nlu:
            print(f"Intent: {parsed_nlu.get('intent', {}).get('name')}")
            print(f"Entities: {parsed_nlu.get('entities')}")

        # --- Example for training (requires a valid training YAML string) ---
        # This is a very minimal example YAML. Your actual YAML will be much larger.
        sample_training_yaml = """
# nlu:
# - intent: greet
#   examples: |
#     - hey
#     - hello
# rules:
# - rule: respond to greet
#   steps:
#   - intent: greet
#   - action: utter_greet
# responses:
#   utter_greet:
#   - text: "Hello there!"
#
# (This sample YAML might be too small to actually train a model,
#  DeepCAL might complain. Use your actual training data.)
"""
        # print("\n--- Attempting to train a model (example, might fail with minimal data) ---")
        # if sample_training_yaml.strip(): # Only if YAML is not empty
        #     try:
        #         model_content, filename = agent.train_model(sample_training_yaml)
        #         print(f"Training started/completed. Model filename (if not using callback): {filename}")
        #         # with open(filename, 'wb') as f:
        #         #     f.write(model_content)
        #         # print(f"Model saved to {filename}")
        #     except Exception as e:
        #         print(f"Training failed: {e}")
        # else:
        #     print("Skipping training example as sample_training_yaml is empty.")

    except requests.exceptions.ConnectionError:
        print(f"Could not connect to DeepCAL server at {DEEPCAL_BASE_URL}. Is it running?")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")