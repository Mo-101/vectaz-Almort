# This data structure would typically be loaded in your actions.py
# (e.g., from a JSON file or defined directly for simplicity here)

report_knowledge_base = {
    "report_date": "3/21/2025",
    "prepared_for": "Logistics Department",
    "analysis_method": "Neutrosophic AHP-TOPSIS Decision Framework",
    "executive_summary": {
        "num_forwarders_analyzed": 7,
        "num_criteria": 4,
        "top_performer": {
            "name": "Kuehne Nagel",
            "coefficient": 0.6876
        },
        "performance_gap_top_two_percentage": 12.3,
        "most_important_criterion": "Cost"
    },
    "methodology": {
        "name": "Neutrosophic AHP-TOPSIS",
        "description": "The evaluation of freight forwarders was conducted using the Neutrosophic AHP-TOPSIS methodology.",
        "components_explained": {
            "Neutrosophic Set Theory": "Handles uncertainty and indeterminacy in decision-making",
            "Analytic Hierarchy Process (AHP)": "Determines criteria weights",
            "Technique for Order Preference by Similarity to Ideal Solution (TOPSIS)": "Ranks alternatives"
        },
        "evaluation_criteria": [
            {"criterion": "Cost", "weight_percentage": 25.0, "type": "Lower is better"},
            {"criterion": "Delivery Performance", "weight_percentage": 25.0, "type": "Higher is better"},
            {"criterion": "Response Rate", "weight_percentage": 25.0, "type": "Higher is better"},
            {"criterion": "Quote Reliability", "weight_percentage": 25.0, "type": "Higher is better"}
        ]
    },
    "comparative_ranking": [
        {"rank": 1, "freight_forwarder": "Kuehne Nagel", "coefficient": 0.6876, "status": "Optimal"},
        {"rank": 2, "freight_forwarder": "DHL Express", "coefficient": 0.5646, "status": "Runner-up"},
        {"rank": 3, "freight_forwarder": "Scan Global Logistics", "coefficient": 0.4906, "status": "Alternative"},
        {"rank": 4, "freight_forwarder": "AGL", "coefficient": 0.2955, "status": "Alternative"},
        {"rank": 5, "freight_forwarder": "DHL Global", "coefficient": 0.2728, "status": "Alternative"},
        {"rank": 6, "freight_forwarder": "Freight In Time", "coefficient": 0.2476, "status": "Alternative"},
        {"rank": 7, "freight_forwarder": "BWOSI", "coefficient": 0.1867, "status": "Alternative"}
    ],
    "forwarder_analysis_details": {
        "Kuehne Nagel": {
            "overall_rank": 1, "closeness_coefficient": 0.6876,
            "scores": {"Cost": 0.63, "Delivery Performance": 0.73, "Response Rate": 0.77, "Quote Reliability": 1.00},
            "strengths": ["Quote Reliability: 1.00", "Response Rate: 0.77", "Delivery Performance: 0.73"],
            "areas_for_improvement": ["No significant weaknesses identified"]
        },
        "DHL Express": {
            "overall_rank": 2, "closeness_coefficient": 0.5646,
            "scores": {"Cost": 0.57, "Delivery Performance": 0.88, "Response Rate": 0.40, "Quote Reliability": 0.52},
            "strengths": ["Delivery Performance: 0.88"],
            "areas_for_improvement": ["Response Rate: 0.40"]
        },
        "Scan Global Logistics": {
            "overall_rank": 3, "closeness_coefficient": 0.4906,
            "scores": {"Cost": 0.36, "Delivery Performance": 0.00, "Response Rate": 0.58, "Quote Reliability": 0.75},
            "strengths": ["Quote Reliability: 0.75"],
            "areas_for_improvement": ["Delivery Performance: 0.00", "Cost: 0.36"]
        },
        "AGL": { # Assuming some data might be missing for full detail pages based on OCR
            "overall_rank": 4, "closeness_coefficient": 0.2955,
            "scores": {}, "strengths": ["Details not fully specified in summary report"], "areas_for_improvement": ["Details not fully specified in summary report"]
        },
        "DHL Global": {
            "overall_rank": 5, "closeness_coefficient": 0.2728,
            "scores": {"Cost": 0.28, "Delivery Performance": 0.00, "Response Rate": 0.22, "Quote Reliability": 0.28},
            "strengths": ["No significant strengths identified"],
            "areas_for_improvement": ["Delivery Performance: 0.00", "Response Rate: 0.22", "Cost: 0.28"]
        },
        "Freight In Time": {
            "overall_rank": 6, "closeness_coefficient": 0.2476,
            "scores": {}, "strengths": ["Details not fully specified in summary report"], "areas_for_improvement": ["Details not fully specified in summary report"]
        },
        "BWOSI": {
            "overall_rank": 7, "closeness_coefficient": 0.1867,
            "scores": {"Cost": 0.30, "Delivery Performance": 0.00, "Response Rate": 0.06, "Quote Reliability": 0.07},
            "strengths": ["No significant strengths identified"],
            "areas_for_improvement": ["Delivery Performance: 0.00", "Response Rate: 0.06", "Quote Reliability: 0.07"]
        }
    },
    "conclusions_and_recommendations": {
        "key_conclusions": [
            "Kuehne Nagel demonstrates the best overall performance with a coefficient of 0.6876.",
            "The performance gap between the top two forwarders is 12.3%.",
            "Cost is the most influential criterion in the evaluation."
        ],
        "recommendations": [
            "Primary Option: Utilize Kuehne Nagel as the preferred freight forwarder for shipments.",
            "Secondary Option: Consider DHL Express as a backup option.",
            "Continuous Monitoring: Regularly reassess performance to ensure continued quality of service.",
            "Negotiation Strategy: Use the performance metrics to negotiate better terms with the top-performing forwarder."
        ]
    }
}

# Helper to get forwarder data with flexible name matching
def get_forwarder_details(forwarder_name_query):
    if not forwarder_name_query: return None
    normalized_query = forwarder_name_query.lower().replace(" ", "")
    for name, data in report_knowledge_base["forwarder_analysis_details"].items():
        normalized_name = name.lower().replace(" ", "")
        if normalized_query == normalized_name or normalized_query in normalized_name:
            return name, data # Return actual name and data
    return None, None