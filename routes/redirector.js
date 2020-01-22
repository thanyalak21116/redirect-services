import express from 'express'

const router = express.Router()

const CONST = {
  /**  @global ecommerce landing page */
  FALLBACK_URL: 'https://www.indexlivingmall.com/',
}

router.get('/:articleNo', (req, res, next) => {
  const { articleNo } = req.params
  try {
    const url = (art => `https://www.google.com?query=${art}`)(articleNo)
    return res.redirect(url)
  } catch (e) {
    // should write log to somewhere
    console.error(e)
    return res.redirect(CONST.FALLBACK_URL)
  }
})

export default router

