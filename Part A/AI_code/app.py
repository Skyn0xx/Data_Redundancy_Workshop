from flask import Flask, request, jsonify
import joblib
import numpy as np

model = joblib.load("iris_model.pkl")

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/predict', methods=['GET'])
def predict():
    try:
        sepal_length = float(request.args.get('sepal_length'))
        sepal_width = float(request.args.get('sepal_width'))
        petal_length = float(request.args.get('petal_length'))
        petal_width = float(request.args.get('petal_width'))

        features = np.array([[sepal_length, sepal_width, petal_length, petal_width]])

        prediction = model.predict(features)
        probabilities = model.predict_proba(features).tolist()[0]
        
        return jsonify({
            "class_name": "Iris-"+["setosa", "versicolor", "virginica"][int(prediction[0])],
            "probabilities": probabilities
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(port=5000, debug=True)