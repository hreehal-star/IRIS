import math

def generate_public_advisory(disaster_data: dict) -> dict:
    disaster_type = disaster_data.get("type", "unknown")
    severity = float(disaster_data.get("severity", 0))
    lat = float(disaster_data.get("latitude", 0))
    lon = float(disaster_data.get("longitude", 0))
    
    # estimate earthquake radius
    if disaster_type == "earthquake":
        impact_radius_km = math.pow(1.5, severity) * 5 
        risk_level = "SEVERE" if severity >= 6.5 else "ELEVATED" if severity >= 5.0 else "MODERATE"
    elif disaster_type == "wildfire":
        impact_radius_km = severity * 2.5 
        risk_level = "SEVERE" if severity >= 7.0 else "ELEVATED"
    else: # conservative estimation for event impact radius
        impact_radius_km = 500 
        risk_level = "SEVERE"

    # safety recommendations for users nearby
    safety_tips = []
    if disaster_type == "earthquake":
        if risk_level in ["SEVERE", "ELEVATED"]:
            safety_tips.extend([
                "Expect significant aftershocks. Keep away from windows and heavy furniture.",
                "If you smell gas, turn off the main gas valve and leave the building immediately.",
                "Do not use elevators. Use stairs if evacuation is necessary."
            ])
        else:
            safety_tips.extend([
                "Be prepared for minor aftershocks.",
                "Check your home for minor structural damage or localized utility leaks."
            ])
    elif disaster_type == "wildfire":
        if risk_level in ["SEVERE", "ELEVATED"]:
            safety_tips.extend([
                "Be ready to evacuate immediately if ordered by local officials.",
                "Keep indoor air clean by closing windows and doors. Use an air purifier if available.",
                "Do not fly drones in the area."
            ])
        else:
            safety_tips.extend([
                "Monitor local news and weather reports for continuous updated"
            
            ])
    else:
        safety_tips.extend([
            "Stay informed through verified news sources and local government alerts.",
            "If you are in the affected region, register your status with your embassy if applicable.",
            "Consider donating to verified humanitarian organizations operating in the area."
        ])

    return {
        "advisory_id": f"ADV-{abs(hash(str(lat)+str(lon))) % 100000}",
        "risk_level": risk_level,
        "impact_radius_km": round(impact_radius_km, 1),
        "advisory_type": "Public Warning" if risk_level == "SEVERE" else "Public Watch",
        "coordinates": f"{lat:.4f}° N, {lon:.4f}° E",
        "safety_tips": safety_tips,
        "summary": f"This is a public safety advisory regarding a {risk_level.lower()} risk {disaster_type}. The primary area of concern extends approximately {round(impact_radius_km, 1)} kilometers from the epicenter."
    }