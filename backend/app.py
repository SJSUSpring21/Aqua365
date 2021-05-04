from flask import Flask
app = Flask(__name__)

@app.route('/testapi', methods=['GET'])
def index():
    return{
        'name': 'Hello from Flask'
    }

if __name__ == '__main__':
    app.run(debug=True)