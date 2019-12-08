const quoteSeperator = /\n----\n/;
const authorSeperator = /\n\s{4}(.*?)$/;
const emptyLine = /^(\s+)?\n+$/
const quoteFileAddress = 'quotes.txt';

const quoteBodyHTMLElement = 'quote-body';
const fromHTMLElement = 'from';
const totalHTMLElement = 'total';
const currentQuoteIndexHTMLElement = 'currentQuoteIndex';


class Quotes {

  constructor() {
    this.htmlFields = {
      quoteBody: document.getElementById(quoteBodyHTMLElement),
      from: document.getElementById(fromHTMLElement),
      total: document.getElementById(totalHTMLElement),
      currentQuoteIndex: document.getElementById(currentQuoteIndexHTMLElement),
    };
    this.quoteIndex = -1;
    this.quotesContainer = [];
    this.getFile();
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

    if (lines[len - 1] =~ emptyLine) {
      lines.splice(-1, 1);
      len = lines.length;
    }
    lines.forEach(item => {
      const quote = { text: '' };

      if (authorSeperator.test(item)) {
        quote.author = item.match(authorSeperator)[1].replace(/\n/, ' ');
        quote.text = item.replace(authorSeperator, '').replace(/\n/, ' ');
      } else {
        quote.text = item.replace(/\n/, ' ');
      }

      this.quotesContainer.push(quote);
    });

    this.htmlFields.total.innerText = `${this.quotesContainer.length}`;
    this.getRandomQuote();
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  calcFontSize(textLength) {
    const baseSize = 5;

    if (textLength >= baseSize) {
      textLength = baseSize - 2;
    }

    const fontSize = baseSize - textLength;

    return `${fontSize}vw`;
  }

  getCurrentQuote() {
    return this.quotesContainer[this.quoteIndex];
  }

  getRandomQuote() {
    this.quoteIndex = this.getRandomInt(this.quotesContainer.length);

    const quote = this.quotesContainer[this.quoteIndex];
    this.htmlFields.quoteBody.innerText = quote.text;
    this.htmlFields.quoteBody.style.fontSize = this.calcFontSize(quote.text.length);

    if (quote.author) {
      this.htmlFields.from.innerText = '—' + quote.author
    } else {
      this.htmlFields.from.innerText = '';
    }

    this.htmlFields.currentQuoteIndex.innerText = `${this.quoteIndex || 0}`;
  }

}

const quote = new Quotes();

const blockquoteWrapper = document.getElementById('blockquote-wrapper');

const copyToClipboard = (ev) => {
  ev.preventDefault();

  const currentQuote = quote.getCurrentQuote();
  let quoteText = currentQuote.text;
  if (currentQuote.author) {
    quoteText += `\n— ${quote.author}`
  }

  try { // Chrome should work
    navigator.permissions.query({name: 'clipboard-write'}).then(result => {
      if (result.state == 'granted' || result.state == 'prompt') {
        navigator.clipboard.writeText(quoteText)
        .catch(e => alert('Unable copying to clipboard: ' + e));
      } else {
        alert('Copy to clipboard is not allowed')
      }
    });

  } catch (e) { // firefox?
    navigator.clipboard.writeText(quoteText)
    .catch(e => alert('Unable copying to clipboard: ' + e));
  }
}

const process_touchstart = (ev) => {
  switch (ev.touches.length) {
    case 2: copyToClipboard(ev); break;
  }
}

// blockquoteWrapper.addEventListener('touchstart', process_touchstart, false);
// blockquoteWrapper.addEventListener('dblclick', copyToClipboard, false);

