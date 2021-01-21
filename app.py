from flask import Flask, render_template, jsonify

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')

@app.route("/1")
def test():
    return render_template('üres.html')


if __name__ == '__main__':
    app.run()
