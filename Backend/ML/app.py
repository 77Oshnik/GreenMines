from flask import Flask, request, jsonify
from flask_cors import CORS
# Import model prediction functions from individual model files
from Transport.transport import predict_emissions_and_risk as predict_transport_emissions
# from fuel_model import predict_emissions_and_risk as predict_fuel_emissions  # Import the appropriate function
# from electricity_model import predict_emissions_and_risk as predict_electricity_emissions  # Import the appropriate function
from Explosives.explosive import predict_7_days_multiple_explosives as predict_7_days_multiple_explosives  # Import the appropriate function

app = Flask(__name__)
CORS(app)

@app.route('/ml/transport', methods=['POST'])
def ml_transport():
    """
    Flask route for the transport model that accepts input data,
    processes it, and returns predictions with risk levels.
    """
    data = request.get_json()  # Get the JSON data from the request
    print("Received data:", data)  # Log the received data
    predictions = predict_transport_emissions(data['days_data'])  # Call the transport model's prediction function
    return jsonify(predictions)  # Return the predictions as a JSON response

@app.route('/ml/explosive', methods=['POST'])
def ml_explosive():
    """
    Flask route for the explosive model that accepts input data,
    processes it, and returns predictions with risk levels.
    """
    data = request.get_json()  # Get the JSON data from the request
        # Call the explosive model's prediction function
    predictions = predict_7_days_multiple_explosives(data['days_data'])
    return jsonify(predictions)  # Return the predictions as a JSON response
 

# @app.route('/ml/fuel', methods=['POST'])
# def ml_fuel():
#     """
#     Flask route for the fuel model that accepts input data,
#     processes it, and returns predictions with risk levels.
#     """
#     data = request.get_json()  # Get the JSON data from the request
#     predictions = predict_fuel_emissions(data['days_data'])  # Call the fuel model's prediction function
#     return jsonify(predictions)  # Return the predictions as a JSON response

# @app.route('/ml/electricity', methods=['POST'])
# def ml_electricity():
#     """
#     Flask route for the electricity model that accepts input data,
#     processes it, and returns predictions with risk levels.
#     """
#     data = request.get_json()  # Get the JSON data from the request
#     predictions = predict_electricity_emissions(data['days_data'])  # Call the electricity model's prediction function
#     return jsonify(predictions)  # Return the predictions as a JSON response



if __name__ == '__main__':
    app.run(debug=True, port=8800)  # Run Flask app on port 5000
