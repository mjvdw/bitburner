from flask import Flask, send_file
from flask_cors import CORS
from turbo_flask import Turbo
import os

app = Flask(__name__)
CORS(app)
turbo = Turbo(app)


@app.route("/")
def scripts_list():
    path = os.path.abspath("scripts")
    scripts = [f for f in os.listdir(
        path) if os.path.isfile(os.path.join(path, f))]

    excluded = [".DS_Store", "index.d.ts"]

    with open("scripts.txt", "w") as file:
        for s in scripts:
            if s not in excluded:
                file.write(f"{s},")

    return send_file("scripts.txt", "txt/plain")


@app.route("/<filename>")
def file(filename):
    path = os.path.abspath("scripts")
    script = path + "/" + filename
    return send_file(script, "text/javascript")
