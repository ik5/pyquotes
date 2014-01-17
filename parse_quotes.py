#!/usr/bin/env python2


QUOTES_FILE = 'quotes.txt'
SEPARATOR = '----\n'
AUTHOR_MARK = '    '


def iter_quotes(quotes_file=QUOTES_FILE):
    "Walks the quotes file, yields (quote, author) tuples for each quote"

    with open(quotes_file) as f:
        quote = []

        for line in f:
            if line != SEPARATOR:
                quote.append(line)
            else:
                if quote[-1].startswith(AUTHOR_MARK):
                    author = quote.pop().strip()
                else:
                    author = None

                yield ''.join(quote).rstrip(), author
                quote = []


if __name__ == '__main__':

    for quote, author in iter_quotes():
        print quote, author
