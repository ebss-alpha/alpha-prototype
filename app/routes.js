const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

module.exports = router

router.get(['/'], (req, res) => {
  req.session.data = {}
  res.render('index.html')
})

router.get(['/start'], (req, res) => {
  req.session.data = {
    cookies: req.session.data.cookies
  }
  res.render('start.html')
})

router.get(['/ni'], (req, res) => {
  req.session.data = {
    cookies: req.session.data.cookies,
    locale: 'ni'
  }
  res.render('ni.html')
})

router.get(['/cookie-choice'], (req, res) => {
  const cookieChoice = req.query.choice === 'accept'
  req.session.data.cookies = cookieChoice
  res.redirect(req.headers.referer)
})

router.get(['/location-check'], (req, res) => {
  switch (req.session.data['where-do-you-live']) {
    case 'northern-ireland':
      if (req.session.data.locale !== 'ni') {
        res.redirect('/ni-not-eligible-yet')
      } else {
        res.redirect('/do-you-have-a-domestic-electricity-meter')
      }
      break
    default:
      req.session.data.locale = 'gb'
      res.redirect('/have-you-received-a-payment-ebss')
      break
  }
})

router.get(['/mains-connection-check'], (req, res) => {
  switch (req.session.data['do-you-have-a-domestic-electricity-meter']) {
    case 'yes':
      res.redirect('/ineligible-for-support-ni')
      break
    case 'no':
    default:
      res.redirect('/do-you-have-a-bank-account')
  }
})

router.get(['/address-lookup'], (req, res) => {
  const homeType = req.session.data['home-type']
  const numberProvided = req.session.data['address-housenumber'].length > 0
  if (numberProvided) {
    switch (homeType) {
      case 'care-home':
        res.redirect('/is-this-your-home')
        break
      default:
        res.redirect('/is-this-your-address')
        break
    }
  } else {
    switch (homeType) {
      case 'care-home':
        res.redirect('/choose-home-address')
        break
      default:
        res.redirect('/choose-your-address')
        break
    }
  }
})

router.get(['/address-confirmation-check'], (req, res) => {
  const homeType = req.session.data['home-type']
  if (req.session.data['is-this-your-address'] === 'yes') {
    switch (homeType) {
      case 'care-home':
        res.redirect('/what-is-your-provider-number')
        break
      default:
        res.redirect('/is-this-your-main-home')
        break
    }
  } else {
    switch (homeType) {
      case 'care-home':
        res.redirect('/what-is-your-home-address')
        break
      default:
        res.redirect('/what-is-your-address')
        break
    }
  }
})

router.get(['/home-check'], (req, res) => {
  if (req.session.data['is-this-your-main-home'] === 'no') {
    res.redirect('/ineligible-second-home')
  } else {
    if (req.session.data.locale === 'ni') {
      res.redirect('/eligible-for-support')
    } else {
      res.redirect('/eligible-for-ebss-af')
    }
  }
})

const describeWhereYouLiveSummary = {
  'house-or-flat-owned': 'I live in a house or flat that my household owns',
  'heat-network': 'I live in a home that has a heat network, communal or district heating',
  'park-home': 'I live in a residential park home',
  'residential-mooring': 'I live on a boat with a permanent residential mooring licence',
  'continous-crusier': 'I live on a boat with a continuous cruising licence',
  farm: 'I live on a farm',
  'permanent-residential': 'I live in a caravan/mobile home on a permanent residential site',
  'pay-for-care': 'I live in a care home and I pay for some or all of my care',
  'private-landlord': 'I rent from a private landlord or agency',
  'council-or-housing-association': 'I rent from a council or housing association',
  other: "I don't fit into any of these categories"
}

router.get(['/user-group-check'], (req, res) => {
  req.session.data['dwyl-summary'] = describeWhereYouLiveSummary[req.session.data['describe-where-you-live']]
  switch (req.session.data['describe-where-you-live']) {
    case 'house-or-flat-rented':
      res.redirect('/house-or-flat-rented')
      break
    case 'house-or-flat-owned':
      res.redirect('/find-your-address')
      break
    case 'park-home':
      res.redirect('/find-your-address')
      break
    case 'care-home':
      res.redirect('/care-home')
      break
    case 'boat':
      res.redirect('/boat')
      break
    case 'farm':
      res.redirect('/find-your-address')
      break
    case 'caravan':
      res.redirect('/caravan')
      break
    case 'other':
    default:
      res.redirect('/find-your-address')
      break
  }
})

router.get(['/situation-specific-check'], (req, res) => {
  req.session.data['dwyl-summary'] = describeWhereYouLiveSummary[req.session.data['situation-specific']]
  switch (req.session.data['situation-specific']) {
    case 'student':
    case 'continuous-cruiser':
    case 'do-not-pay-for-care':
    case 'not-fixed':
      res.redirect('/ineligible-home-type')
      break
    default:
      res.redirect('/find-your-address')
      break
  }
})

router.get(['/fuel-check'], (req, res) => {
  const ineligibleFuels = ['mains-gas', 'electric', 'heat-network']
  const receivedMainEbss = req.session.data['received-main-ebss'] === 'yes'
  const afpIneligible = req.session.data['do-you-use-one-of-these-fuels'].some(fuel => ineligibleFuels.includes(fuel))
  if (afpIneligible && !receivedMainEbss) {
    res.redirect('/ebss-only-afp-ineligible')
  } else if (afpIneligible && receivedMainEbss) {
    res.redirect('/cannot-apply-afp-ineligible')
  } else if (!afpIneligible) {
    res.redirect('/have-you-received-a-payment-afp')
  }
})

router.get(['/ebss-check'], (req, res) => {
  switch (req.session.data['received-main-ebss']) {
    case 'yes':
      res.redirect('/ineligible-for-ebss-af')
      break
    case 'no':
    default:
      res.redirect('/do-you-have-a-bank-account')
      break
  }
})

router.get(['/afp-check'], (req, res) => {
  const receivedMainEbss = req.session.data['received-main-ebss'] === 'yes'
  const receivedAfp = req.session.data['received-main-afp'] === 'yes'
  if (receivedAfp && !receivedMainEbss) {
    res.redirect('/ebss-only-had-afp')
  } else if (!receivedAfp && !receivedMainEbss) {
    res.redirect('/afp-and-ebss')
  } else if (!receivedAfp && receivedMainEbss) {
    res.redirect('/afp-only')
  } else {
    res.redirect('/cannot-apply-had-afp')
  }
})

router.get(['/contact-check'], (req, res) => {
  const y = req.session.data['dob-year'].length > 0 ? parseInt(req.session.data['dob-year']) : 1930
  const m = req.session.data['dob-month'].length > 0 ? parseInt(req.session.data['dob-month']) - 1 : 0
  const d = req.session.data['dob-day'].length > 0 ? parseInt(req.session.data['dob-day']) : 1
  req.session.data.dob = new Date(y, m, d)
  res.redirect('/what-are-your-bank-account-details')
})

router.get(['/council-tax-check', '/rates-check'], (req, res) => {
  const proofRequired = req.session.data['describe-where-you-live'] === 'care-home' || req.session.data['rates-or-council-tax'] === 'no' || req.session.data.locale === 'ni'
  if (proofRequired) {
    res.redirect('/upload-proof-of-address?uploaded=1')
  } else {
    res.redirect('/what-is-your-full-name')
  }
})

router.get(['/upload-check'], (req, res) => {
  if (req.query.continue) {
    res.redirect('/what-is-your-full-name')
  } else {
    if (req.query['upload-multiple'] !== undefined && req.query['proof-of-address'].length !== 0) {
      req.session.data.error = false
      if (req.session.data['proofs-of-address'] === undefined) req.session.data['proofs-of-address'] = []
      req.session.data['proofs-of-address'] = req.session.data['proofs-of-address'].concat(req.session.data['proof-of-address'])
      res.redirect('/upload-proof-of-address')
    } else {
      req.session.data.error = true
      res.redirect('/upload-proof-of-address')
    }
  }
})

router.get(['/bank-account-check'], (req, res) => {
  switch (req.session.data['do-you-have-a-bank-account']) {
    case 'yes':
      res.redirect('/describe-where-you-live')
      break
    case 'no':
    default:
      res.redirect('/get-a-bank-account')
      break
  }
})

router.get(['/live-bank-check'], (req, res) => {
  switch (req.session.data['sort-code'].trim().replaceAll('-', '')) {
    case '999999':
      res.redirect('/check-your-bank-details')
      break
    default:
      res.redirect('/check-your-answers')
  }
})

router.get(['/find-my-energy-provider'], (req, res) => {
  const providers = require('./data/providers.json')
  res.render('find-my-energy-provider.html', {
    providers: providers
  })
})

router.get(['/applying-for-residents-check'], (req, res) => {
  const applyingForResidents = req.session.data['applying-for-residents'] === 'yes'
  if (applyingForResidents) {
    req.session.data.residents = []
    res.redirect('/you-will-need-consent')
  } else {
    res.redirect('/find-your-address')
  }
})

router.get(['/add-resident'], (req, res) => {
  const y = req.session.data['resident-dob-year'].length > 0 ? parseInt(req.session.data['resident-dob-year']) : 1930
  const m = req.session.data['resident-dob-month'].length > 0 ? parseInt(req.session.data['resident-dob-month']) - 1 : 0
  const d = req.session.data['resident-dob-day'].length > 0 ? parseInt(req.session.data['resident-dob-day']) : 1
  const newResident = {
    name: req.session.data['name-of-resident'],
    dob: new Date(y, m, d)
  }
  if (req.session.data.residents === undefined) req.session.data.residents = []
  req.session.data.residents.push(newResident)
  res.redirect('/resident-bank-details')
})

router.get(['/add-another'], (req, res) => {
  switch (req.session.data['add-another']) {
    case 'yes':
      res.redirect('/resident-details')
      break
    case 'no':
    default:
      res.redirect('/check-your-residents')
      break
  }
})
