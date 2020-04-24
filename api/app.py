from flask import Flask, make_response
from flask_restful import Api, Resource
import json

app = Flask(__name__)
api = Api(app)

users = [
    {'username': 'zlind', 'id': 0},
    {'username': 'zberg', 'id': 1}
]

@api.resource('/')
class Index(Resource):
    def get(self):
        return make_response(
            json.dumps(users),
            200,
            {'content-type': 'application/json'}
        )

if __name__ == '__main__':
    app.run()
