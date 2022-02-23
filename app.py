import logging
from flask import Flask, send_file, request
from flask_cors import CORS
from turbo_flask import Turbo
import os

app = Flask(__name__)
CORS(app)
turbo = Turbo(app)

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

ROOT = "scripts/dist/"
PATHS = ["", "lib/"]


@app.route("/")
def scripts_list():
    scripts = []
    for p in PATHS:
        path = os.path.abspath(ROOT + p)
        scripts.extend([p + f for f in os.listdir(
            path) if os.path.isfile(os.path.join(path, f))])

    excluded = [".DS_Store", "index.d.ts"]

    with open("scripts.txt", "w") as file:
        for s in scripts:
            if s not in excluded and s.endswith(".js"):
                file.write(f"{s},")

    return send_file("scripts.txt", "txt/plain")


@ app.route("/<path:filename>")
def file(filename):
    path = os.path.abspath(ROOT)
    script = path + "/" + filename
    return send_file(script, "text/javascript")
