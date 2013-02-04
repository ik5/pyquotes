#!/usr/bin/env python2
#
#
#

import os
import sys
import fdb
import logging
import atexit

class Converter(object) :

    def __init__(self, logger, connection) :
        self.logger = logger
        self.con    = connection

    def insert_to_db(quote, author) :
        cursor = con.cursor()
        author_id = None
        if author :
            try :
                cursor.execute(('insert into quote_authors(AUTHOR)' 
                                'values(?)'), author)

                cursor.execute(('select id from quote_authors' 
                                'where author=?'), author)

                author_id = cursor[0]
            except :
                pass

        try :
          cursor.execute(('insert into quotes(body, author_ref) '
                          'values(?, ?)'), quote, author)

          con.commit()
        except :
            return False

        return True

    def parse(*a_list) :
        quote  = ''
        author = ''
        lines  = a_list
        
        if a_list[-1].startswith('    ') :
            author = lines.pop().strip()
        
        qoute = ''.join(lines).rstrip()
        return self.insert_to_db(quote, author)

    def iterate_quote() :
        full_quote = []

        with open('quotes.txt') as a_file :
            for line in a_file :
                if line == '----\n' :
#
                    self.parse(full_quote)
                    full_quote = []
                else :
                    full_quote.append(line)


#def init_logger() :
##
## readability over everything else !
## http://www.python.org/dev/peps/pep-0008/#pet-peeves <- Really ? 
## I'm an Object Pascal developer, and that's how we do things, 
## even our editors/ide support this :P
##
#
#    return logger
#
#def finalize(db_connection) :
#    if not db_connection.closed :
#        db_connection.close
#
#def parse_list(a_list, con, logger) :
#    if not a_list :
#       return None
#
#    return None
#
#logger = init_logger()
#logger.info('Entering convert_quotes.py')
#
#
#if not os.path.exists('quotes.txt') :
#    logger.critical('The file quotes.txt was not found')
#    sys.exit('Error: Could not find the quotes.txt file, bye')
#
#try :
#    con = fdb.connect(
#                       dsn      = '127.0.0.1:quotes',
#                       user     = 'sysdba', 
#                       password = 'masterkey'
#                     )
#
#    logger.info('Connected to the database')
#
#except fdb.DatabaseError as e :
#    logger.critical('Database connection error: %s', e)
#    sys.exit       ('Database error: {0}'.format(e))
#
#atexit.register(finalize, con)
#
#with open('quotes.txt') as a_file :
#    full_quote = []
#
#    for line in a_file :
#        if line == '----\n' :
#            # 
#            #
#            
#            full_quote = []
#        else :
#            full_quote.append(line)
#            
#
#
#
