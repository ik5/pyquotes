#!/usr/bin/env python2

import os
import sys
import fdb

if not os.path.exists('quotes.txt') :
    sys.exit('Error: Could not find the quotes.txt file, bye')

try :
    con = fdb.connect(
                       dsn      = '127.0.0.1:quotes',
                       user     = 'sysdba', 
                       password = 'masterkey'
                     )
except fdb.DatabaseError as e :
    sys.exit("Database error: {0}".format(e))



