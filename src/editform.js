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
      link: '',
      descr: '',
      image: ''
    }
  },
  initialize: function (options) {
    // constructor
    L.Util.setOptions(this, options)
  },
  getData: function () {
    return {
      title: this.input.value,
      link: this.linki.value,
      descr: this.descri.value,
      image: this.imagei.value
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

    // descr
    group = L.DomUtil.create('div', 'form-group', this.form)
    label = L.DomUtil.create('label', '', group)
    label.innerHTML = 'popis'
    this.descri = L.DomUtil.create('textarea', 'form-control form-control-sm', group)
    // this.input.placeholder = this.options.placeholder
    this.descri.value = this.options.data.descr || ''

    // url
    group = L.DomUtil.create('div', 'form-group', this.form)
    label = L.DomUtil.create('label', '', group)
    label.innerHTML = 'odkaz na detail'
    this.linki = L.DomUtil.create('input', 'form-control form-control-sm', group)
    this.linki.type = 'text'
    // this.linki.placeholder = 'nepovinné'
    this.linki.value = this.options.data.link || ''

    // image
    group = L.DomUtil.create('div', 'form-group', this.form)
    label = L.DomUtil.create('label', '', group)
    label.innerHTML = 'obrázek'
    this.imagei = L.DomUtil.create('input', 'form-control form-control-sm', group)
    this.imagei.type = 'text'
    this.imagei.value = this.options.data.image || ''

    L.DomEvent.disableClickPropagation(container)
    return container
  },
  onRemove: function (map) {
    // when removed
  }
})
