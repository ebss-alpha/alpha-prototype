const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

module.exports = router

const afpOptions = ['gas', 'oil', 'wood', 'solid-fuel', 'heat-network']

router.get(['/'], (req, res) => {
  req.session.data = {}
  res.render('index.html')
})

router.get(['/afp-check'], (req, res) => {
  if (afpOptions.some(option => option === req.session.data['central-heating-type'])) {
    res.redirect('/afp-and-ebss')
  } else {
    res.redirect('/ebss-only')
  }
})

router.get(['/third-party-check'], (req, res) => {
  if (req.session.data['applying-for-yourself-or-someone-else'] === 'myself') {
    res.redirect('/what-is-your-address')
  } else {
    res.redirect('/third-party-route')
  }
})

router.get(['/home-check'], (req, res) => {
  if (req.session.data['is-this-your-main-home'] === 'yes') {
    res.redirect('/central-heating-type')
  } else {
    res.redirect('/ineligible-second-home')
  }
})

router.get(['/contact-check'], (req, res) => {
  if (req.session.data['no-phone'] && req.session.data['no-email']) {
    res.redirect('/difficult-to-contact-individuals')
  } else {
    res.redirect('/does-your-household-pay-council-tax')
  }
})

router.get(['/council-tax-check'], (req, res) => {
  if (req.session.data['does-your-household-pay-council-tax'] === 'yes') {
    res.redirect('/is-your-name-on-the-council-tax-bill')
  } else {
    res.redirect('/upload-proof-of-address')
  }
})

router.get(['/name-on-bill-check'], (req, res) => {
  if (req.session.data['is-your-name-on-the-council-tax-bill'] === 'yes') {
    res.redirect('/do-you-have-a-bank-account')
  } else {
    res.redirect('/name-not-on-bill')
  }
})

router.get(['/bank-account-check'], (req, res) => {
  if (req.session.data['do-you-have-a-bank-account'] === 'yes') {
    res.redirect('/what-are-your-bank-account-details')
  } else {
    res.redirect('/non-bank-account')
  }
})
