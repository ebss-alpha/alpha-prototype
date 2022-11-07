const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

module.exports = router

const afpOptions = ['gas', 'lpg', 'bio-oil', 'oil', 'wood', 'solid-fuel', 'other']

router.get(['/'], (req, res) => {
  req.session.data = {}
  res.render('index.html')
})

router.get(['/afp-check'], (req, res) => {
  const receivedMainEbss = req.session.data['received-main-ebss'] === 'yes'
  const useAlternativeFuel = afpOptions.some(option => option === req.session.data['do-you-use-one-of-these-fuels'])
  if (useAlternativeFuel && !receivedMainEbss) {
    res.redirect('/afp-and-ebss')
  } else if (useAlternativeFuel && receivedMainEbss) {
    res.redirect('/afp-only')
  } else if (!useAlternativeFuel && receivedMainEbss) {
    res.redirect('/cannot-apply')
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
    res.redirect('/have-you-received-a-payment-already')
  } else {
    res.redirect('/ineligible-second-home')
  }
})

router.get(['/contact-check'], (req, res) => {
  if (req.session.data['no-phone'] && req.session.data['no-email']) {
    res.redirect('/difficult-to-contact-individuals')
  } else {
    res.redirect('/is-your-name-on-your-council-tax-bill')
  }
})

router.get(['/council-tax-check'], (req, res) => {
  switch (req.session.data['is-your-name-on-your-council-tax-bill']) {
    case 'no':
      res.redirect('/name-not-on-bill')
      break
    case 'no-council-tax':
      res.redirect('/describe-where-you-live')
      break
    case 'yes':
    default:
      res.redirect('/do-you-have-a-bank-account')
      break
  }
})

router.get(['/bank-account-check'], (req, res) => {
  if (req.session.data['do-you-have-a-bank-account'] === 'yes') {
    res.redirect('/payment-options-check')
  } else {
    res.redirect('/no-bank-account-check')
  }
})

router.get(['/payment-options-check'], (req, res) => {
  const paysCouncilTax = req.session.data['is-your-name-on-your-council-tax-bill'] === 'yes'
  const hasBank = req.session.data['do-you-have-a-bank-account'] === 'yes'
  if (hasBank && paysCouncilTax) {
    res.redirect('/preferred-payment')
  } else {
    res.redirect('/what-are-your-bank-account-details')
  }
})

router.get(['/preferred-payment-check'], (req, res) => {
  switch (req.session.data['preferred-payment']) {
    case 'bank':
      res.redirect('/what-are-your-bank-account-details')
      break
    case 'council-tax':
    default:
      res.redirect('/council-tax-rebate')
  }
})

router.get(['/no-bank-account-check'], (req, res) => {
  switch (req.session.data['is-your-name-on-your-council-tax-bill']) {
    case 'no-council-tax':
      res.redirect('/voucher-option')
      break
    case 'yes':
    default:
      res.redirect('/council-tax-rebate')
  }
})
