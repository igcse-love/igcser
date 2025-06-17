(function () {
  'use strict'
  if (!Array.isArray) {
    Array.isArray = function (arg) {
      return Object.prototype.toString.call(arg) === '[object Array]'
    }
  }
  var qs = {
    get: function () {
      var query = window.location.search
      var obj = {}
      if (query === '') return obj
      query = query.slice(1)
      query = query.split('&')
      query.map(function (part) {
        var key
        var value
        part = part.split('=')
        key = part[0]
        value = part[1]
        if (!obj[key]) {
          obj[key] = value
        } else {
          if (!Array.isArray(obj[key])) {
            obj[key] = [obj[key]]
          }
          obj[key].push(value)
        }
      })
      return obj
    },
  }
  if (window) {
    if (!window.qs) {
      window.qs = qs;
    } else {
      throw new Error('Error bootstrapping qs: window.qs already set.');
    }
  }
})()

function searchCard(k, v) {
  const card = document.createElement('div')
  card.classList.add('mdc-card')
  card.innerHTML = `<div class="mdc-card__primary-action">
    <div class="mdc-card__media">
      <span class="material-symbols-rounded">${v.icon}</span>
    </div>
    <div class="mdc-card__ripple"></div>
  </div>
  <div class="mdc-card-wrapper__text-section">
    <h3>${k.split('_').join(' ').toUpperCase()}</h3>
    <p>${v.text}</p>
  </div>
  <div class="mdc-card__actions">
    <div class="mdc-card__action-buttons">
      <button class="mdc-button mdc-card__action mdc-card__action--button" onclick="window.open('${v.path}')">
        <div class="mdc-button__ripple"></div>
        <span class="mdc-button__label">Open</span>
      </button>
    </div>
  </div>`
  return card
}

const chipset = mdc.chips.MDCChipSet.attachTo(document.querySelector('.mdc-chip-set'))
const sniper = document.querySelector('#sniper')
const querybar = component('text-field', document.querySelector('.search-actions .mdc-text-field'))
const query = querybar.root.querySelector('input')

const req = qs.get()
if ('q' in req && req.q) {
  query.value = req.q
  querybar.root.querySelector('.mdc-floating-label').classList.add('mdc-floating-label--float-above')
}

sniper.addEventListener('click', async e => {
  const scopes = []
  const chips = document.querySelectorAll('.mdc-chip--selected')
  for (const chip of chips) {
    const text = chip.querySelector('.mdc-chip__text').innerHTML
    const words = text.toLowerCase().split(' ')
    const scope = words.join('_')
    scopes.push(scope)
  }
  const response = await fetch(`/api/search?q=${query.value}${scopes.length ? '&scopes=' + scopes.join(',') : ''}`)
  const data = await response.json()
  if (data.error) return
  const cards = document.querySelector('.search-cards')
  cards.innerHTML = ''
  for (const [k, v] of Object.entries(data)) {
    cards.appendChild(searchCard(k, v))
  }
  for (const button of document.querySelectorAll('.mdc-card .mdc-button')) {
    component('ripple', button)
  }
})