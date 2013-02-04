#!/usr/bin/env python2
#
#
#

import os
import sys
import fdb
import logging

#
# readability over everything else ;)
# Hey, I'm an Object Pascal developer, and that's how we do things :P
#
logger    = logging.getLogger   ('convert_quotes'                           )
handler   = logging.FileHandler ('log/convert.log'                          )
formatter = logging.Formatter   ('[%(asctime)s - %(levelname)s] %(message)s')

handler.setFormatter (formatter    )
logger.addHandler    (handler      )
logger.setLevel      (logging.DEBUG)


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


