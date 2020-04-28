from flask import Flask, make_response, request
from flask_cors import CORS
from flask_restful import Api, Resource
import json, boto3

app = Flask(__name__)
CORS(app)
api = Api(app)

db = boto3.resource('dynamodb', region_name='us-west-1')
users = db.Table('zlind-game-users')

def format_response(obj={}, success=True):
    responseObj = {'success': success}
    for key, value in obj.items():
        responseObj[key] = value;
    return make_response(
        json.dumps(responseObj),
        200,
        {'content-type': 'application/json'}
    )

@api.resource('/users')
class Users(Resource):
    # HTTP GET - return users list
    def get(self):
        if request.args and 'name' in request.args:
            name = request.args['name']
            response = users.get_item(Key={'username': name})
            if 'Item' in response:
                return format_response({'user': response['Item']})
            else:
                return format_response({'message': 'user not found'}, False)
        return format_response({'users': users.scan()['Items']})
    # HTTP PUT - create new user
    def put(self):
        data = request.json
        user = data['user']
        user.logged_in = true;
        response = users.get_item(Key={'username': user['username']})
        good = 'Item' not in response
        if good:
            users.put_item(Item=user)
            return format_response({'user': user})
        return format_response({'message': 'username taken'}, False)
    # HTTP POST - login/logout existing user
    def post(self):
        data = request.json
        user = data['user']
        searchKey = {'username': user['username']}
        response = users.get_item(Key=searchKey)
        good = 'Item' in response and \
         response['Item']['password'] == user['password']
        if good:
            if data['action'] == 'login':
                response = users.update_item(
                    Key=searchKey,
                    UpdateExpression='SET logged_in = :l',
                    ExpressionAttributeValues={':l': True},
                    ReturnValues='ALL_NEW'
                )
            elif data['action'] == 'logout':
                response = users.update_item(
                    Key=searchKey,
                    UpdateExpression='SET logged_in = :l',
                    ExpressionAttributeValues={':l': False},
                    ReturnValues='ALL_NEW'
                )
            return format_response({'user': response['Attributes']})
        return format_response({'message': 'username taken'}, False)


if __name__ == '__main__':
    app.run()
