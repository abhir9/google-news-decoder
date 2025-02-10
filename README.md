# Google News Decoder

A Node.js module to decode Google News article URLs.

## Installation

```sh
npm install google-news-decoder
```

## Usage

```
const GoogleNewsDecoder = require("google-news-decoder");

(async () => {
  const decoder = new GoogleNewsDecoder();
  const sourceUrl = "https://news.google.com/rss/articles/CBMi0wFBVV...";
  const decoded = await decoder.decodeGoogleNewsUrl(sourceUrl);
  console.log(decoded);
})();
```


## Features
- Extracts and decodes article links from Google News
- Works with RSS and standard Google News URLs
- Supports proxy configuration

## Author
[Abhimanyu Singh Rathore](https://github.com/abhir9)

## License
MIT