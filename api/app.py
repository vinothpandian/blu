import json
from collections import defaultdict

from flask import Flask, send_file, request, jsonify
from flask_cors import CORS

import pandas as pd
import numpy as np
from pathlib import Path

app = Flask(__name__)
CORS(app)

blu_path = Path("./blu")
dataset_path = blu_path.joinpath("annotated")

dataset_details = pd.read_csv(blu_path.joinpath("dataset.csv"))

categories = list(dataset_details["category"].unique())


@app.route("/api/categories")
def get_categories():
    return jsonify(categories)


@app.route("/api/app-names/<category>")
def get_app_names(category):
    data = dataset_details[dataset_details["category"] == category]
    data_dict = data.drop(columns=['category']).to_dict(orient='records')
    app_names = defaultdict(list)
    for v in data_dict:
        app_names[v['name']].append(v["filename"])
    return jsonify(app_names)


@app.route('/api/get-annotation/<category>/<app_name>/<filename>')
def get_annotation(category, app_name, filename):
    annotation_file_path = dataset_path.joinpath(
        category, app_name, f"annotation_{filename}.json").as_posix()

    with open(annotation_file_path, "r") as f:
        data = json.load(f)

    return jsonify(data)


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5000, load_dotenv=".env")
