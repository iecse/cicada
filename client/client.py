import sys

import requests

import os

import json

interact_type = sys.argv[1]

#utoken = os.environ.get('utoken')
utoken = "utoken1"

if interact_type == "ranks":
    try:

        url = 'http://localhost:5000/api/leaderboard'

        response = requests.get(url)

        response.raise_for_status()

        resp_json = response.json()

        rank = 1
        for ele in resp_json['lb']:
            print( "Rank " + str(rank) + " - " + str(ele['uname']) + " - " + str(ele['points']) )
            rank += 1

    except Exception as e:
        print( "error occured" )

elif interact_type == "answer":
    try:
        question = sys.argv[2]

        flag = sys.argv[3]

        headers = {
            'Content-Type': 'application/json',
        }

        payload = {
            'utoken' : utoken,
            'question' : question,
            'flag' : flag
        }

        url = 'http://localhost:5000/api/submitAnswer'

        response = requests.post(url, headers=headers, data=json.dumps(payload))

        response.raise_for_status()

        resp_json = response.json()

        print( resp_json['msg'] )
    
    except Exception as e:
        print( "error occured" )

else:
    print( "invalid request" )