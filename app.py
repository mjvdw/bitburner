from flask import Flask
from turbo_flask import Turbo
import threading
import time
import random

app = Flask(__name__)
turbo = Turbo(app)


@app.before_first_request
def before_first_request():

    threading.Thread(target=update_load).start()


def update_load():
    with app.app_context():
        while True:
            print("Turbo!!")
            time.sleep(5)
            turbo.push(turbo.update(main(), None))


@app.route("/")
def main():
    i = random.randint(0, 100)
    return f"{i}"
