from flask import Flask, make_response, request
from flask_cors import CORS
from flask_restful import Api, Resource
import json, boto3

app = Flask(__name__)
CORS(app)
api = Api(app)

db = boto3.resource('dynamodb', region_name='us-west-1')
users = db.Table('zlind-game-users')

@api.resource('/users')
class Users(Resource):
    # HTTP GET - return users list
    def get(self):
        scan = users.scan()
        return make_response(
            json.dumps(scan['Items']),
            200,
            {'content-type': 'application/json'}
        )
    # HTTP PUT - create new user
    def put(self):
        data = request.json
        response = users.get_item(Key={'username': data['username']})
        good = 'Item' not in response
        if good:
            users.put_item(Item = {
                'username': data['username'],
                'password': data['password']
            })
        return make_response(
            json.dumps({'success': good}),
            200,
            {'content-type': 'application/json'}
        )
    # HTTP POST - login existing user
    def post(self):
        data = request.json
        response = users.get_item(Key={'username': data['username']})
        good = 'Item' in response and response['Item']['password'] == data['password']
        return make_response(
            json.dumps({'success': good}),
            200,
            {'content-type': 'application/json'}
        )


if __name__ == '__main__':
    app.run()
