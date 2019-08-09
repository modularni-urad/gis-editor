/* global L */

export default class EF {
  constructor (map) {
    this.map = map
    this.form = null
  }
  hide () {
    this.form.remove()
  }
  show (data) {
    this.form = new _EditForm({ data })
    this.form.addTo(this.map)
  }
}

const _EditForm = L.Control.extend({
  options: {
    // topright, topleft, bottomleft, bottomright
    position: 'topright',
    placeholder: 'sem více info (nepovinné)',
    data: {
      title: '',
      link: ''
    }
  },
  initialize: function (options) {
    // constructor
    L.Util.setOptions(this, options)
  },
  getData: function () {
    return {
      title: this.input.value,
      link: this.linki.value
    }
  },
  onAdd: function (map) {
    // happens after added to map
    var container = L.DomUtil.create('div', 'search-container')
    this.form = L.DomUtil.create('form', 'form frm', container)

    // title
    var group = L.DomUtil.create('div', 'form-group', this.form)
    var label = L.DomUtil.create('label', '', group)
    label.innerHTML = 'název/poznámka'
    this.input = L.DomUtil.create('input', 'form-control form-control-sm', group)
    this.input.type = 'text'
    // this.input.placeholder = this.options.placeholder
    this.input.value = this.options.data.title || ''

    // url
    group = L.DomUtil.create('div', 'form-group', this.form)
    label = L.DomUtil.create('label', '', group)
    label.innerHTML = 'odkaz na detail'
    this.linki = L.DomUtil.create('input', 'form-control form-control-sm', group)
    this.linki.type = 'text'
    // this.linki.placeholder = 'nepovinné'
    this.linki.value = this.options.data.link || ''

    L.DomEvent.disableClickPropagation(container)
    return container
  },
  onRemove: function (map) {
    // when removed
  },
  keyup: function(e) {
    if (e.keyCode === 38 || e.keyCode === 40) {
      // do nothing
    } else {
      this.results.innerHTML = ''
      if (this.input.value.length > 2) {
        var value = this.input.value
        var results = _.take(_.filter(this.options.data, function(x) {
          return x.feature.properties.park.toUpperCase().indexOf(value.toUpperCase()) > -1
        }).sort(sortParks), 10)
        _.map(results, function(x) {
          var a = L.DomUtil.create('a', 'list-group-item')
          a.href = ''
          a.setAttribute('data-result-name', x.feature.properties.park)
          a.innerHTML = x.feature.properties.park
          this.results.appendChild(a)
          L.DomEvent.addListener(a, 'click', this.itemSelected, this)
          return a
        }, this)
      }
    }
  }
})
