const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

module.exports = router

router.get(['/'], (req, res) => {
  req.session.data = {}
  res.render('index.html')
})

router.get(['/start'], (req, res) => {
  req.session.data = {}
  res.render('start.html')
})

router.get(['/is-your-name-on-your-council-tax-bill'], (req, res) => {
  req.session.data['is-your-name-on-your-council-tax-bill'] = undefined
  res.render('is-your-name-on-your-council-tax-bill.html')
})

router.get(['/third-party-check'], (req, res) => {
  if (req.session.data['applying-for-yourself-or-someone-else'] === 'myself') {
    res.redirect('/is-your-name-on-your-council-tax-bill')
  } else {
    res.redirect('/third-party-route')
  }
})

router.get(['/initial-council-tax-check'], (req, res) => {
  switch (req.session.data['is-your-name-on-your-council-tax-bill']) {
    case 'no':
    case 'no-council-tax':
      res.redirect('/find-your-address')
      break
    case 'yes':
    default:
      res.redirect('/find-your-address')
      break
  }
})

router.get(['/address-lookup'], (req, res) => {
  const numberProvided = req.session.data['address-housenumber'].length > 0
  if (numberProvided) {
    res.redirect('/is-this-your-address')
  } else {
    res.redirect('/choose-your-address')
  }
})

router.get(['/address-confirmation-check'], (req, res) => {
  if (req.session.data['is-this-your-address'] === 'yes') {
    res.redirect('/is-this-your-main-home')
  } else {
    res.redirect('/what-is-your-address')
  }
})

router.get(['/home-check'], (req, res) => {
  if (req.session.data['is-this-your-main-home'] === 'no') {
    res.redirect('/ineligible-second-home')
  } else {
    res.redirect('/describe-where-you-live')
  }
})

router.get(['/user-group-check'], (req, res) => {
  switch (req.session.data['describe-where-you-live']) {
    case 'house-or-flat-rented':
      res.redirect('/house-or-flat-rented')
      break
    case 'house-or-flat-owned':
      res.redirect('/have-you-received-a-payment-ebss')
      break
    case 'park-home':
      res.redirect('/have-you-received-a-payment-ebss')
      break
    case 'care-home':
      res.redirect('/care-home')
      break
    case 'boat':
      res.redirect('/boat')
      break
    case 'farm':
      res.redirect('/have-you-received-a-payment-ebss')
      break
    case 'caravan':
      res.redirect('/caravan')
      break
    case 'other':
    default:
      res.redirect('/have-you-received-a-payment-ebss')
      break
  }
})

router.get(['/house-or-flat-rented-check'], (req, res) => {
  switch (req.session.data['situation-specific']) {
    default:
      res.redirect('/have-you-received-a-payment-ebss')
      break
  }
})
router.get(['/house-or-flat-owned-check'], (req, res) => {
  switch (req.session.data['situation-specific']) {
    default:
      res.redirect('/have-you-received-a-payment-ebss')
      break
  }
})
router.get(['/care-home-check'], (req, res) => {
  switch (req.session.data['situation-specific']) {
    default:
      res.redirect('/have-you-received-a-payment-ebss')
      break
  }
})
router.get(['/boat-check'], (req, res) => {
  switch (req.session.data['situation-specific']) {
    default:
      res.redirect('/have-you-received-a-payment-ebss')
      break
  }
})
router.get(['/caravan-check'], (req, res) => {
  switch (req.session.data['situation-specific']) {
    default:
      res.redirect('/have-you-received-a-payment-ebss')
      break
  }
})

router.get(['/fuel-check'], (req, res) => {
  const ineligibleFuels = ['mains-gas', 'electric', 'heat-network']
  const receivedMainEbss = req.session.data['received-main-ebss'] === 'yes'
  const afpIneligible = req.session.data['do-you-use-one-of-these-fuels'].some(fuel => ineligibleFuels.includes(fuel))
  if (afpIneligible && !receivedMainEbss) {
    res.redirect('/ebss-only')
  } else if (afpIneligible && receivedMainEbss) {
    res.redirect('/cannot-apply')
  } else if (!afpIneligible) {
    res.redirect('/have-you-received-a-payment-afp')
  }
})

router.get(['/afp-check'], (req, res) => {
  const receivedMainEbss = req.session.data['received-main-ebss'] === 'yes'
  const receivedAfp = req.session.data['received-main-afp'] === 'yes'
  if (receivedAfp && !receivedMainEbss) {
    res.redirect('/ebss-only')
  } else if (!receivedAfp && !receivedMainEbss) {
    res.redirect('/afp-and-ebss')
  } else if (!receivedAfp && receivedMainEbss) {
    res.redirect('/afp-only')
  } else {
    res.redirect('/cannot-apply')
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
    case 'no-council-tax':
      res.redirect('/upload-proof-of-address')
      break
    default:
      res.redirect('/do-you-have-a-bank-account')
      break
  }
})

router.get(['/bank-account-check'], (req, res) => {
  const hasBank = req.session.data['do-you-have-a-bank-account'] === 'yes'
  const proofOfAddressProvided = req.session.data['proof-of-address-provided'] === 'yes'
  if (hasBank) {
    res.redirect('/what-are-your-bank-account-details')
  } else if (!hasBank && !proofOfAddressProvided) {
    res.redirect('/upload-proof-of-address')
  } else if (!hasBank && proofOfAddressProvided) {
    res.redirect('/voucher-option')
  }
})

router.get(['/find-my-energy-provider'], (req, res) => {
  const providers = require('./data/providers.json')
  res.render('find-my-energy-provider.html', {
    providers: providers
  })
})
