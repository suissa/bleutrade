const actions = {
  public: require('../../apis/public'),
}

const {
  byDESC,
  byPositiveLastDailyChange,
  toChangeData,
  byMarketname_BTC,
  byLastAndAVGChangesPositives,
} = require('../../helpers')

const moreVolatile = async () => {
  try {
    const res = await actions.public.getmarketsummaries()

    const result = res.filter(byPositiveLastDailyChange)
      .map(toChangeData)
      .filter(byMarketname_BTC)
      .filter(byLastAndAVGChangesPositives)
      .sort(byDESC('LastChange'))

    return result
  } catch (error) {
    throw new Error(error.stack)
  }
}

module.exports = moreVolatile