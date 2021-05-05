from flask import Flask
import pymongo
from pymongo import MongoClient
app = Flask(__name__)

cluster = MongoClient("mongodb+srv://admin:saiyangoku@cluster0.p6nod.mongodb.net/Aqua365?retryWrites=true&w=majority")
db = cluster["Aqua365"]
collection = db["collectedData"]

@app.route('/testapi', methods=['GET'])
def index():
    # id = collection.insert_one({"test": "success"}).inserted_id
    # print(id)
    return{
        'name': 'Hello from Flask'
    }

if __name__ == '__main__':
    app.run(debug=True)