#!/usr/bin/env python2

from os import path

if not path.exits('quotes.txt') :
    sys.stderr 'Could not find the quotes.txt file, bye'
    sys.exit(-1)

print "here"

