const Airtable = require('airtable')

const base = new Airtable({

  apiKey:
    process.env.AIRTABLE_TOKEN,

}).base(
  process.env.AIRTABLE_BASE_ID
)

module.exports = base