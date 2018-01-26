const moreVolatile = require('./moreVolatile')
const { byPositiveChangeAndLastAboveAVG } = require('../../helpers')
const getPositiveChangeAndLastAboveAVG = async () => {
  try {
    const res = await moreVolatile()
    return res.filter(byPositiveChangeAndLastAboveAVG)
  } catch (error) {
    throw new Error(error.stack)
  }

}

module.exports = getPositiveChangeAndLastAboveAVG