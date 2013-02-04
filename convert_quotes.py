#!/usr/bin/env python2
#
#
#

import os
import sys
import fdb
import logging
import atexit

#
# readability over everything else !
# http://www.python.org/dev/peps/pep-0008/#pet-peeves <- Really ? 
# I'm an Object Pascal developer, and that's how we do things, 
# even our editors/ide support this :P
#
logger    = logging.getLogger   ('convert_quotes'                           )
handler   = logging.FileHandler ('log/convert.log'                          )
formatter = logging.Formatter   ('[%(asctime)s - %(levelname)s] %(message)s')

handler.setFormatter (formatter    )
logger.addHandler    (handler      )
logger.setLevel      (logging.DEBUG)

logger.info('entering convert_quotes.py')

def finalize(db_connection) :
    if not db_connection.closed :
        db_connection.close

if not os.path.exists('quotes.txt') :
    logger.critical('The file quotes.txt was not found')
    sys.exit('Error: Could not find the quotes.txt file, bye')

try :
    con = fdb.connect(
                       dsn      = '127.0.0.1:quotes',
                       user     = 'sysdba', 
                       password = 'masterkey'
                     )

    logger.info('Connected to the database')

except fdb.DatabaseError as e :
    logger.critical('Database connection error: %s', e)
    sys.exit       ('Database error: {0}'.format(e))

atexit.register(finalize, con)

with open('quotes.txt') as a_file :
    full_quote = []

    for line in a_file :
        if line == '----\n' :
            # 
            #

            full_quote = []
        else :
            full_quote.append(line)
            



