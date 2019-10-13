const quoteSeperator = /\n----\n/;
const authorSeperator = /^\s{4}(.*?)$/;
const quoteFileAddress = 'quotes.txt';

const quoteBodyHTMLElement = 'quote-body';
const fromHTMLElement = 'from';


class Quotes {
  htmlFields = { quoteBody: null, from: null };
  quotesContainer = [];

  constructor() {
    this.htmlFields.quoteBody = document.getElementById(quoteBodyHTMLElement);
    this.htmlFields.from = document.getElementById(fromHTMLElement);
    this.getFile();
  }

  async getFile() {
    const utf8Decoder = new TextDecoder('utf-8');
    try {
      const response = await window.fetch(quoteFileAddress);
      if (!response.ok) {
        alert('Something went wrong');
        return;
      }
      const reader = response.body.getReader();
      let { value: chunk, done: readerDone } = await reader.read();
      chunk = chunk ? utf8Decoder.decode(chunk) : '';
      this.parseContent(chunk);
    } catch (e) {
      alert("Unable to get quote file: " + e.message);
      return
    }
  }

  parseContent(content) {
    console.log('parseContent');
    let line = '';
    let index = 0;
    const lines = content.split(quoteSeperator);
    console.log(lines.length, lines[0], lines[1], lines[2]);

  }

  getRandomQuote() {
    console.log('getRandomQuote');
  }

}

const quote = new Quotes();

quote.getRandomQuote();
