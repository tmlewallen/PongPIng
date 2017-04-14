import sys
from random import randint
from time import sleep, time
from pymongo import MongoClient
from pymongo.errors import BulkWriteError
from pprint import pprint

import serial
import os
import traceback

def connect(url, usr, pwd):
    if url == None or usr == None or pwd == None:
        print('Missing connection details!')
        print('Defaulting to localhost...')
        return MongoClient(connect=True).PongPing
    print('Connecting to ' + url + '...')
    connString = 'mongodb://' + usr + ':' + pwd + '@' + url
    return MongoClient(connString, connect=True, socketTimeoutMS=1000, serverSelectionTimeoutMS=200).heroku_0x5v55l7

def main(sys, os):
    if len(sys.argv) < 2:
        print(sys.argv)
        print('Usage : python3 serial_reader.py <USB PORT>')
        return

    port = sys.argv[1]
    ser = serial.Serial(port, 19200)

    url = os.environ.get('MONGO_URL')
    usr = os.environ.get('MONGO_USR')
    pwd = os.environ.get('MONGO_PWD')

    db = None
    curr = 0
    delta = 0
    count = 0
    db = connect(url,usr,pwd)
    col = db.pong
    buff = []
    lastInsert = time()
    last = 0
    BUFFER_LIMIT = 500
    _id = int(time())
    while True:
        try:
            read_serial = ser.readline()
            curr = int(read_serial, 16)

            delta = curr - last
            ts = time()
            datum = {
                "_id": ts,
                "tableId": 1,
                "rawVal": curr,
                "delta": delta,
                "timestamp":ts
            }

            if len(buff) >= BUFFER_LIMIT or ts - lastInsert > 3:
                buff.append(datum)
                col.insert_many(buff, ordered=True)
                buff = []
                lastInsert = ts
            else:
                buff.append(datum)

            last = curr
        except BulkWriteError as err :
            pprint(err.details)
            pprint(datum)
            buff = []
        except Exception as e:
            traceback.print_exc()

        print('Input Buffer : ' + str(ser.in_waiting))
        _id += 1
main(sys, os)


