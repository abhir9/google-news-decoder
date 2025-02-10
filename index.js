const axios = require("axios");
const cheerio = require("cheerio");
const { URL } = require("url");

class GoogleNewsDecoder {
  constructor(proxy = null) {
    this.proxy = proxy;
  }

  getBase64Str(sourceUrl) {
    try {
      const url = new URL(sourceUrl);
      const pathParts = url.pathname.split("/");
      if (
        url.hostname === "news.google.com" &&
        pathParts.length > 1 &&
        ["articles", "read"].includes(pathParts[pathParts.length - 2])
      ) {
        return { status: true, base64Str: pathParts[pathParts.length - 1] };
      }
      return { status: false, message: "Invalid Google News URL format." };
    } catch (error) {
      return { status: false, message: `Error in getBase64Str: ${error.message}` };
    }
  }

  async getDecodingParams(base64Str) {
    const fetchParams = async (url) => {
      try {
        const response = await axios.get(url, { proxy: this.proxy });
        const $ = cheerio.load(response.data);
        const dataElement = $("c-wiz > div[jscontroller]").first();

        if (!dataElement.length) {
          return { status: false, message: "Failed to fetch data attributes." };
        }

        return {
          status: true,
          signature: dataElement.attr("data-n-a-sg"),
          timestamp: dataElement.attr("data-n-a-ts"),
          base64Str,
        };
      } catch (error) {
        return { status: false, message: `Request error: ${error.message}` };
      }
    };

    let result = await fetchParams(`https://news.google.com/articles/${base64Str}`);
    if (!result.status) {
      result = await fetchParams(`https://news.google.com/rss/articles/${base64Str}`);
    }
    return result;
  }

  async decodeUrl(signature, timestamp, base64Str) {
    try {
      const url = "https://news.google.com/_/DotsSplashUi/data/batchexecute";
      const payload = [
        "Fbv4je",
        `["garturlreq",[["X","X",["X","X"],null,null,1,1,"US:en",null,1,null,null,null,null,null,0,1],"X","X",1,[1,1,1],1,1,null,0,0,null,0],"${base64Str}",${timestamp},"${signature}"]`,
      ];

      const response = await axios.post(
        url,
        `f.req=${encodeURIComponent(JSON.stringify([[payload]]))}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
          },
          proxy: this.proxy,
        }
      );

      const data = response.data.split("\n\n")[1];
      const decodedUrl = JSON.parse(JSON.parse(data)[0][2])[1];
      return { status: true, decodedUrl };
    } catch (error) {
      return { status: false, message: `Error in decodeUrl: ${error.message}` };
    }
  }

  async decodeGoogleNewsUrl(sourceUrl, interval = null) {
    try {
      const base64Response = this.getBase64Str(sourceUrl);
      if (!base64Response.status) return base64Response;

      const decodingParamsResponse = await this.getDecodingParams(base64Response.base64Str);
      if (!decodingParamsResponse.status) return decodingParamsResponse;

      if (interval) await new Promise((resolve) => setTimeout(resolve, interval * 1000));

      return this.decodeUrl(
        decodingParamsResponse.signature,
        decodingParamsResponse.timestamp,
        decodingParamsResponse.base64Str
      );
    } catch (error) {
      return { status: false, message: `Error in decodeGoogleNewsUrl: ${error.message}` };
    }
  }
}

module.exports = GoogleNewsDecoder;
