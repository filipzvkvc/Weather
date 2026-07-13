const { isEmail } = require('validator')
const tlds = require('tlds')

const tldSet = new Set(tlds.map((t) => t.toUpperCase()))

function validEmail(email) {
  if (!isEmail(email)) return false
  const tld = email.split('.').pop().toUpperCase()
  return tldSet.has(tld)
}

module.exports = { validEmail }
