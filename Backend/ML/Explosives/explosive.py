# Import necessary libraries
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import os

# Initialize the LabelEncoder instance
le = LabelEncoder()
scaler = StandardScaler()
model = RandomForestRegressor()
# Set the base directory and paths to the model, label encoder, and scaler
base_dir = os.path.dirname(os.path.abspath(__file__))
scaler_path = os.path.join(base_dir, 'scaler.pkl')
label_encoder_path = os.path.join(base_dir, 'label_encoder.pkl')
model_path = os.path.join(base_dir, 'random_forest_model.pkl')

# Load the LabelEncoder from the file
le = joblib.load(label_encoder_path)
scaler = joblib.load(scaler_path)
model = joblib.load(model_path)
# Now, 'le' is correctly loaded as an instance of LabelEncoder



# Function to handle unseen explosive types
def safe_transform(encoder, value):
    # Ensure the value is a string before transforming
    if not isinstance(value, str):
        print(f"Warning: '{value}' is not a string, returning placeholder value!")
        return -1  # Return a placeholder value if the input is not a string
    
    try:
        # Try transforming the value
        return encoder.transform([value])[0]
    except ValueError:
        # If the value is not recognized by the encoder, return a placeholder value
        print(f"Warning: '{value}' is an unseen category! Returning placeholder value.")
        return -1  # Assign a placeholder value for unseen types


# Risk evaluation thresholds
def risk_evaluation(row):
    thresholds = {
        'CO': (400, 700),
        'NOx': (20, 40),
        'NH3': (50, 80),
        'HCN': (20, 50),
        'H2S': (20, 50),
        'SO2': (1, 5),
        'CO2': (1000, 5000)
    }
    risks = []
    for gas, (low, high) in thresholds.items():
        value = row[gas]
        if value > high:
            risks.append(f'{gas} - High')
        elif value > low:
            risks.append(f'{gas} - Moderate')
        else:
            risks.append(f'{gas} - Low')
    return risks

# Function to predict emissions and evaluate risks for multiple explosives per day
def predict_7_days_multiple_explosives(input_data):
    """
    Predict emissions and evaluate risks for each day over 7 days, where each day can contain one or more explosive types.

    Parameters:
    input_data (list of lists): List containing explosive types and amounts for each day.
                                E.g., [['TNT', 3000], ['Dynamite', 2000], ...]

    Returns:
    dict: Dictionary with predictions for each day.
    """
    all_predictions = {}

    # Loop through each day in the input data (days can have multiple explosives)
    for day, explosives in enumerate(input_data, start=1):
        daily_predictions = []

        for explosive_type, amount in explosives:
            # Prepare a DataFrame for the explosive
            input_df = pd.DataFrame([[explosive_type, amount]], columns=['explosiveType', 'amount'])

            # Encode explosive type
            input_df['explosiveType'] = input_df['explosiveType'].apply(lambda x: safe_transform(le, x))

            # Scale the input data
            input_df_scaled = scaler.transform(input_df)

            # Predict emissions for this explosive type
            predicted_emissions = model.predict(input_df_scaled)

            # Create a DataFrame for the predictions
            predicted_df = pd.DataFrame(predicted_emissions, columns=['CO', 'NOx', 'NH3', 'HCN', 'H2S', 'SO2', 'CO2'])

            # Add risk evaluations
            predicted_df['Risk Evaluation'] = predicted_df.apply(risk_evaluation, axis=1)

            # Append the predictions for this explosive type
            daily_predictions.append(predicted_df[['Risk Evaluation', 'CO', 'NOx', 'NH3', 'HCN', 'H2S', 'SO2', 'CO2']].to_dict(orient='records'))

        # Store the predictions for the day
        all_predictions[f"Day {day}"] = daily_predictions

    return all_predictions