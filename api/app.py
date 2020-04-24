from flask import Flask, make_response
from flask_cors import CORS
from flask_restful import Api, Resource
import json, boto3

app = Flask(__name__)
CORS(app)
api = Api(app)

db = boto3.resource('dynamodb', region_name='us-west-1')
users = db.Table('zlind-game-users')

@api.resource('/')
class Index(Resource):
    def get(self):
        scan = users.scan()
        return make_response(
            json.dumps(scan['Items']),
            200,
            {'content-type': 'application/json'}
        )

if __name__ == '__main__':
    app.run()
