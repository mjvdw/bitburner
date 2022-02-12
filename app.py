from flask import Flask, send_file
from turbo_flask import Turbo
import os

app = Flask(__name__)
turbo = Turbo(app)


@app.route("/")
def scripts_list():
    path = os.path.abspath("scripts")
    scripts = [f for f in os.listdir(
        path) if os.path.isfile(os.path.join(path, f))]
    response = {
        "scripts": scripts
    }
    return response


@app.route("/<file>")
def file(file):
    return "A thing"
