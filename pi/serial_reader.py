import sys
from random import randint
from time import sleep, time
from pymongo import MongoClient

import serial
import os


def main(sys, os):
    if len(sys.argv) < 2:
        print(sys.argv)
        print('Usage : python3 serial_reader.py <USB PORT>')
        return

    port = sys.argv[1]
    ser = serial.Serial(port, 14400)

    url = os.environ.get('MONGO_URL')
    usr = os.environ.get('MONGO_USR')
    pwd = os.environ.get('MONGO_PWD')

    db = None
    if url == None or usr == None or pwd == None:
        print('Connecting to localhost...')
        db = MongoClient().PongPing
    else :
        print('Connecting to ' + url + '...')
        connString = 'mongodb://' + usr + ':' + pwd + '@' + url
        db = MongoClient(connString).heroku_0x5v55l7
    print('Connected!')
    col = db.pong

    curr = 0
    last = 0
    count = 0
    while True:
        read_serial = ser.readline()
        curr = int(ser.readline(), 16)
        # curr = randint(0,1000)
        val = curr - last
        print(val)
        ts = time()
        datum = {
            "tableId": 1,
            "rawVal" : curr,
            "delta": val,
            "timestamp":ts
        }
        if count > 1800:
            col.insert_one(datum)
        last = curr
        sleep(1)
        count += 1

main(sys, os)
