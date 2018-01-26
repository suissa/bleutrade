const moreVolatile = require('./moreVolatile')
const { byPositiveChangeAndLastAboveAVG } = require('../../helpers')
const getPositiveChangeAndLastAboveAVG = async () => {
  try {
    const res = await moreVolatile()

    const result = res.filter(byPositiveChangeAndLastAboveAVG)
    return result
  } catch (error) {
    throw new Error(error.stack)
  }

}

module.exports = getPositiveChangeAndLastAboveAVG