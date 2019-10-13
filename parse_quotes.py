#!/usr/bin/env python3


QUOTES_FILE = 'quotes.txt'
SEPARATOR = '----\n'
AUTHOR_MARK = '    '


def iter_quotes(quotes_file=QUOTES_FILE):
    "Walks the quotes file, yields (quote, author) tuples for each quote"

    with open(quotes_file) as f:
        quotes = []

        for line in f:
            if line != SEPARATOR:
                quotes.append(line)
            else:
                if quotes[-1].startswith(AUTHOR_MARK):
                    author = quotes.pop().strip()
                else:
                    author = None

                yield ''.join(quotes).rstrip(), author
                quotes = []


if __name__ == '__main__':

    for quote, author in iter_quotes():
        print quote, author
