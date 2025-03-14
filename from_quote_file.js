const quoteSeperator = /\n----\n/;
const authorSeperator = /\n\s{4}(.*?)$/;
const emptyLine = /^(\s+)?\n+$/
const quoteFileAddress = 'quotes.txt';

const quoteBodyHTMLElement = 'quote-body';
const fromHTMLElement = 'from';
const totalHTMLElement = 'total';
const currentQuoteIndexHTMLElement = 'currentQuoteIndex';
const og_title = 'og_title';
const og_description = 'og_description';
const og_url = 'og_url';


class Quotes {

  constructor() {
    this.htmlFields = {
      quoteBody: document.getElementById(quoteBodyHTMLElement),
      from: document.getElementById(fromHTMLElement),
      total: document.getElementById(totalHTMLElement),
      currentQuoteIndex: document.getElementById(currentQuoteIndexHTMLElement),
      og_title: document.getElementById(og_title),
      og_description: document.getElementById(og_description),
      og_url: document.getElementById(og_url),
    };
    this.url = {
      hash: '',
      args: [],
    }
    this.quoteIndex = -1;
    this.quotesContainer = [];

    this.parseUrl(window.location.href);
    this.getFile();

    window.onpopstate = this.onHistoryChanged.bind(this);
  }

  getFile() {

    fetch(quoteFileAddress)
    .then(response => {
      response.text().then(
        content => this.parseContent(content)
      )
    })
    .catch(e => alert("Unable to get quote file: " + e));

  }

  parseContent(content) {
    const lines = content.split(quoteSeperator);
    let len = lines.length;

    if (emptyLine.test(lines[len - 1])) {
      lines.splice(-1, 1);
      len = lines.length;
    }
    lines.forEach(item => {
      const quote = { text: '', author: ''};

      if (authorSeperator.test(item)) {
        quote.author = item.match(authorSeperator)[1].replace(/\n/, ' ');
        quote.text = item.replace(authorSeperator, '').replace(/\n/, ' ');
      } else {
        delete quote.author
        quote.text = item.replace(/\n/, ' ');
      }

      this.quotesContainer.push(quote);
    });

    this.htmlFields.total.innerText = `${this.quotesContainer.length}`;

    this.getQuote();
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  calcFontSize(textLength) {
    const baseSize = 4;

    if (textLength >= baseSize) {
      textLength = baseSize - 2;
    }

    const fontSize = baseSize - textLength;

    return `${fontSize}vw`;
  }

  getCurrentQuote() {
    return this.quotesContainer[this.quoteIndex];
  }

  extractUrlQuoteNumber() {
    let quoteIndex = -1;
    this.url.args.forEach( (value) => {
      if (value.key === "quote") {
        quoteIndex = parseInt(value.value, 10);
        return;
      }
    } );
    return quoteIndex;
  }

  getQuote(clicked) {
    let quoteNumber = null
    if (!clicked) {
      if (this.url.hash != '') {
        quoteNumber = parseInt(this.url.hash, 10);
      } else if (this.url.args.length > 0) {
        quoteNumber = this.extractUrlQuoteNumber();
      }
    }

    if (quoteNumber === null ||
        isNaN(quoteNumber) ||
          quoteNumber >= this.quotesContainer.length) {
      this.getRandomQuote();
    } else {
        this.quoteIndex = quoteNumber;
    }
    const quote = this.quotesContainer[this.quoteIndex];
    if (!quote || quote === undefined || quote === null) {
      console.error("quote is empty", quote);
      return;
    }
    this.htmlFields.quoteBody.innerText = quote.text;
    this.htmlFields.quoteBody.style.fontSize = this.calcFontSize(quote.text.length);

    this.htmlFields.from.innerText = ''

    if (quote.hasOwnProperty('author')) {
      this.htmlFields.from.innerText = '—' + quote.author
    }

    this.htmlFields.currentQuoteIndex.innerText = `${this.quoteIndex || 0}`;
    // NOTE: This is a small bug of twice having the same history
    // TODO: fix it :D
    if (clicked !== false) {
      window.history.pushState({quote: this.quoteIndex}, document.head.title, `?quote=${this.quoteIndex}`);
    }

    this.htmlFields.og_url.content = window.location.href;
    this.htmlFields.og_title.content = quote.text.substring(0, 12);
    this.htmlFields.og_description.content = quote.text;
    if (quote.hasOwnProperty('author')) {
      this.htmlFields.og_description.content += quote.author;
    }
  }

  getRandomQuote() {
    this.quoteIndex = this.getRandomInt(this.quotesContainer.length);
  }

  parseUrl(urlString) {
    let url = new URL(urlString || window.location.href);
    if (url.hash != '') {
      this.url.hash = url.hash.replace('#', '');
    }

    this.url.args = [];
    url.searchParams.forEach((value, key) => this.url.args.push({ key, value }));
  }

  onHistoryChanged(e) {
    this.parseUrl(window.location.href);
    this.getQuote();
  }

}

const quote = new Quotes();

