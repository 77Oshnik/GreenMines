# fuel.py
import pandas as pd
import numpy as np
import joblib as joblib
import json as json
import os as os
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor

label_encoder = LabelEncoder()
scaler = StandardScaler()
model = RandomForestRegressor()


# Load the LabelEncoder and scaler from files
base_dir = os.path.dirname(os.path.abspath(__file__))
scaler_path = os.path.join(base_dir,  'fuel_scaler.pkl')
label_encoder_path = os.path.join(base_dir, 'fuel_label_encoder.pkl')
model_path = os.path.join(base_dir, 'fuel_model.pkl')


model = joblib.load(model_path)
scaler = joblib.load(scaler_path)
label_encoder = joblib.load(label_encoder_path)

# Risk level function
def assign_risk(value, emission_type):
    thresholds = {
        'CO2 (kg)': [2000, 9000, 15000],
        'Nitrous Oxide CO2e (kg)': [200, 500, 1000],
        'Methane CO2e (kg)': [30, 100, 200],
        'Total Direct CO2e (kg)': [2000, 9000, 15000],
        'Indirect CO2e (kg)': [500, 1000, 1500],
        'Life Cycle CO2e (kg)': [10000, 15000, 20000]
    }

    if emission_type in thresholds:
        if value < thresholds[emission_type][0]:
            return "Low Risk"
        elif value < thresholds[emission_type][1]:
            return "Moderate Risk"
        elif value < thresholds[emission_type][2]:
            return "High Risk"
        else:
            return "Severe Risk"
    return "Unknown"

# Predict emissions and risk
def predict_emissions_and_risk(daily_fuel_data):
    """
    Predict emissions and risk levels for 7 days of fuel data.
    Args:
        daily_fuel_data (list): A list of 7 days, each containing tuples of fuel type and volume.
    Returns:
        dict: JSON-formatted predictions with risk levels.
    """
    results = []

    for day_index, fuels in enumerate(daily_fuel_data, start=1):
        for fuel_type, volume in fuels:
            # Encode fuel type and prepare data
            fuel_encoded = label_encoder.transform([fuel_type])[0]
            input_features = np.array([[fuel_encoded, volume]])  # numpy array

            # Convert input to DataFrame with the feature names used during training
            input_df = pd.DataFrame(input_features, columns=["Fuel", "Quantity Fuel Consumed (liters)"])

            # Scale the input features
            input_scaled = scaler.transform(input_df)

            # Predict emissions
            prediction = model.predict(input_scaled)[0]

            # Create result for this fuel, rounding the emission values to 3 decimal places
            fuel_result = {
                "fuel_type": fuel_type,
                "quantity_fuel_consumed_liters": volume,
                "emissions": {
                    "CO2 (kg)": round(prediction[0], 3),
                    "Nitrous Oxide CO2e (kg)": round(prediction[1], 3),
                    "Methane CO2e (kg)": round(prediction[2], 3),
                    "Total Direct CO2e (kg)": round(prediction[3], 3),
                    "Indirect CO2e (kg)": round(prediction[4], 3),
                    "Life Cycle CO2e (kg)": round(prediction[5], 3)
                },
                "risk_levels": {
                    "CO2 (kg)": assign_risk(prediction[0], "CO2 (kg)"),
                    "Nitrous Oxide CO2e (kg)": assign_risk(prediction[1], "Nitrous Oxide CO2e (kg)"),
                    "Methane CO2e (kg)": assign_risk(prediction[2], "Methane CO2e (kg)"),
                    "Total Direct CO2e (kg)": assign_risk(prediction[3], "Total Direct CO2e (kg)"),
                    "Indirect CO2e (kg)": assign_risk(prediction[4], "Indirect CO2e (kg)"),
                    "Life Cycle CO2e (kg)": assign_risk(prediction[5], "Life Cycle CO2e (kg)")
                }
            }

            # Append the result for this fuel to the daily predictions
            results.append({
                "day": day_index,
                "fuel_data": fuel_result
            })

    # Return the formatted JSON response with the "status" and "predictions" keys
    response = {
        "status": "success",
        "predictions": results
    }

    return response