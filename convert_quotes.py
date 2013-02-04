#!/usr/bin/env python2

from os import path
from sys import exit
import fdb

if not path.exists('quotes.txt') :
    exit('Error: Could not find the quotes.txt file, bye')



