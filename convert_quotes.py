#!/usr/bin/env python2
#
#
#

import os
import sys
import fdb
import logging
import atexit

def init_logger() :
    """initialize the logger"""
#
# readability over everything else !
# http://www.python.org/dev/peps/pep-0008/#pet-peeves <- Really ? 
# I'm an Object Pascal developer, and that's how we do things, 
# even our editors/ide support this :P
#
    logger    = logging.getLogger('convert_quotes')
    handler   = logging.FileHandler('log/convert.log')
    formatter = logging.Formatter(('[%(asctime)s - %(levelname)s] '
                                   '%(message)s'))
    return logger



LOGGER = init_logger()
LOGGER.info('Entering convert_quotes.py')
QUOTES_FILE = 'quotes.txt'
SEPARATOR   = '----\n'
AUTHOR_MARK = '    '



def init_db(logger = LOGGER) :
    """initialize the database connection
       raised an fdb.DatabaseError if database error"""

    try :
        con = fdb.connect(
                          dsn      = '127.0.0.1:quotes',
                          user     = 'sysdba', 
                          password = 'masterkey'
                         )

        logger.info('Connected to the database')

    except fdb.DatabaseError as e :
        logger.critical('Database connection error: %s', e)
        raise e

    return con

def finalize(db_connection, logger=LOGGER) :
    """close the database connection"""
    if not db_connection.closed :
        logger.info('Closing database connection')
        db_connection.close
    else :
        logger.error('The database connection is already closed')


def iter_quotes(quotes_file = QUOTES_FILE) :
    "Walks over the quotes file, yields (quote, author) tuples for each quote"

    with open(quotes_file) as f:
        quote = []

        for line in f:
            if line != SEPARATOR :
                if line.strip :
                    quote.append(line)

            else :
                if not quote : # quote is empty ?
                    continue

                # try to extract the author if exists 
                if quote[-1].startswith(AUTHOR_MARK) :
                    author = quote.pop().strip()
                else : # mark it as none it it was not found
                    author = None

                yield ''.join(quote).rstrip(), author
                quote = []

def insert_to_db(con, quote, author, logger=LOGGER) :
    cursor = con.cursor()
    author_id = None
    if author :
        try :
            cursor.execute('insert into quote_authors(AUTHOR) values(?)', 
                           author)
        except fdb.DatabaseError as e : 
            # usually means that the author already exists ...
            logger.info('Could not insert author (%s): %s', (author, e))

        try :
            cursor.execute('select id from quote_authors where author=?', 
                           author)

            author_id = cursor.fetchone['id']
        except fdb.DatabaseError as e : # could not get the author id
            logger.info('Could not find author (%s): %s', (author, e))

    try :
        cursor.execute(('insert into quotes(body, author_ref) '
            'values(?, ?)'), quote, author)

        con.commit()
    except fdb.DatabaseError as e : # could not execute query or commit
        logger.error('Could not insert quote: %s', e)
        return False

    return True


if __name__ == '__main__':
    pass
