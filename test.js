const GoogleNewsDecoder = require("./index");

(async () => {
  const decoder = new GoogleNewsDecoder();
  const sourceUrl = "https://news.google.com/rss/articles/CBMi0wFBVV95cUxPYUlRMHdjVkJuaXI4a2NiM1Nwczg1Q1lMNXNBUGg1Z0w5cFV5X3hlZ2hCR1hJbnJQS1U2Um9UZEc5U0NWNlZBN1l4MnhhdktjQWcxMkk3WXI4blpmU3RoUFpXWG9tM3RIQTZ3NFFiTXN5bHRNemFrTFBnOVZjRm9iaWFPYXFqM25FcDFoN0VWN3BGODlKaVA0RVVJT1c0WnRtVWpWNk14ckxFVjBqNHVxQ0VJVWlKanpjQm5mUW82bmV4djhVZW1iQXFUbDVxM1Y0bmU0?oc=5";
  const decoded = await decoder.decodeGoogleNewsUrl(sourceUrl, 5);
  console.log(decoded);
})();
