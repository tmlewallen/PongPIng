import sys
from random import randint
from time import sleep, time
from pymongo import MongoClient

import serial
import os


def main(sys, os):
    url = os.environ['MONGO_URL']
    usr = os.environ['MONGO_USR']
    pwd = os.environ['MONGO_PWD']
    connString = ''
    if url != None :
        connString = 'mongodb://' + usr + ':' + pwd + '@' + url
    print(sys.argv)
    if len(sys.argv) < 2:
        print(sys.argv)
        return
    port = sys.argv[1]
    # ser = serial.Serial(port, 14400)
    curr = 0
    last = 0
    db = None
    if connString == '':
        print('Connecting to localhost...')
        db = MongoClient().PongPing
    else :
        print('Connecting to ' + url)
        print(connString)
        db = MongoClient(connString).heroku_0x5v55l7
    print('Connected!')
    col = db.pong
    while True:
        # read_serial = ser.readline()
        # curr = int(ser.readline(), 16)
        curr = randint(0,1000)
        val = curr - last
        print(val)
        ts = time()
        datum = {
            "tableId": 1,
            "raw-val" : curr,
            "val": val,
            "timestamp":ts
        }
        col.insert_one(datum)
        last = curr
        sleep(1)

main(sys, os)