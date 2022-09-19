const axios = require('axios')

class Translo {
  constructor(apikey, errors=true) {
    this.host = 'translo.p.rapidapi.com'
    this.apikey = apikey
    this.errors = errors
    this.client = axios.create({
      baseURL: `https://${this.host}/api/v3/`,
      headers: {
        'X-RapidAPI-Host': this.host,
        'X-RapidAPI-Key': this.apikey
      }
    })
  }

  /**
  * @param {string} text - is required
  * @param {string} toLang - is required
  * @param {string} fromLang - is optional
  * 
  * Translate text. Keeps emoji and html in safe and sound
  */
  async translate(text, toLang, fromLang) {
    if (this.errors) {
      if (!text) {
        throw new Error('[Translo] text is required')
      }
      if (!toLang) {
        throw new Error('[Translo] toLang is required')
      }
    }

    let body = new URLSearchParams({
      text: text,
      to: toLang
    })

    if (fromLang) {
      body.from = fromLang
    }

    try {
      let response = await this.client.post('translate', body, {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        }
      })
      return response.data
    } catch(e) {
      throw Error(e)
    }
  }

  /**
  * @param {array|string} body - is required
  * 
  * Translates batches in fixed order
  */
  async batchTranslate(body=[]) {
    if (this.errors) {
      if (!body) {
        throw new Error('[Translo] request body is required')
      }
    }

    try {
      let response = await this.client.post('batch_translate', body, {
        headers: {
          'content-type': 'application/json',
        }
      })
      return response.data
    } catch(e) {
      throw Error(e)
    }
  }

  /**
  * @param {string} text - is required
  * 
  * Detect language of text
  */
  async detect(text) {
    if (this.errors) {
      if (!text) {
        throw new Error('[Translo] text is required')
      }
    }

    try {
      let response = await this.client.get('detect', {
        params: {
          text
        }
      })
      return response.data
    } catch(e) {
      throw Error(e)
    }
  }
}

module.exports = Translo