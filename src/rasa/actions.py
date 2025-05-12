from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import os
import requests
import logging

logger = logging.getLogger(__name__)

# Use environment variable for API_BASE, default to localhost if not set.
API_BASE = os.environ.get("API_BASE", "http://localhost:8000")

class ActionGetRankings(Action):
    def name(self) -> Text:
        return "action_get_rankings"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        payload = {
            "matrix": [[1200, 92, 5], [1000, 85, 9], [1300, 97, 3], [1100, 90, 4]],
            "forwarders": ["A", "B", "C", "D"]
        }
        try:
            res = requests.post(f"{API_BASE}/rankings", json=payload, timeout=5)
            res.raise_for_status()  # Ensure HTTP errors raise exceptions
            results = res.json()
            if not isinstance(results, list):
                logger.error("Unexpected response format: expected a list.")
                dispatcher.utter_message(text="Sorry, something went wrong with the rankings data.")
                return []
            message = "\n".join([
                f"{r.get('forwarder', 'Unknown')}: {r.get('closenessCoefficient', 'N/A')}" 
                for r in results
            ])
            dispatcher.utter_message(text=f"📊 Forwarder Rankings:\n{message}")
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching rankings: {e}")
            dispatcher.utter_message(text="Sorry, I couldn't fetch the rankings at this time. Please try again later.")
        except ValueError as e:
            logger.error(f"Error parsing response JSON: {e}")
            dispatcher.utter_message(text="Received unexpected data format from the rankings service.")
        return []

class ActionExplainRanking(Action):
    def name(self) -> Text:
        return "action_explain_ranking"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        try:
            explanation = "DeepCAL ranks forwarders based on cost, reliability, and responsiveness using AHP-TOPSIS."
            dispatcher.utter_message(text=explanation)
        except Exception as e:
            logger.error(f"Error explaining ranking: {e}")
            dispatcher.utter_message(text="Sorry, I encountered an error explaining the ranking.")
        return []

class ActionGetDeepSightAlerts(Action):
    def name(self) -> Text:
        return "action_get_deep_sight_alerts"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        try:
            # In the future, you can replace this with a call to an alerts API.
            alert_message = "🧠 DeepSight: No disruption flags currently. You're clear to ship."
            dispatcher.utter_message(text=alert_message)
        except Exception as e:
            logger.error(f"Error in deep sight alerts: {e}")
            dispatcher.utter_message(text="Sorry, I encountered an error while checking for alerts.")
        return []
