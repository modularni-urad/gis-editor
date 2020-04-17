/* global L, _ */

export default class EF {
  constructor (map, settings) {
    this.map = map
    this.form = null
    this.settings = settings
  }

  hide () {
    this.form.remove()
  }

  show (data) {
    this.form = new _EditForm({ data, settings: this.settings })
    this.form.addTo(this.map)
  }
}

const _EditForm = L.Control.extend({
  options: {
    // topright, topleft, bottomleft, bottomright
    position: 'topright',
    placeholder: 'sem více info (nepovinné)',
    data: {}
  },
  initialize: function (options) {
    // constructor
    L.Util.setOptions(this, options)
  },
  getData: function () {
    function _constructInfo () {
      return _.reduce(this.options.settings, (acc, i) => {
        acc[i] = this.inputs[i].value
        return acc
      }, {})
    }
    return this.options.settings
      ? _constructInfo()
      : JSON.parse(this.jsoninfo.value)
  },
  onAdd: function (map) {
    // happens after added to map
    var container = L.DomUtil.create('div', 'search-container')
    this.form = L.DomUtil.create('form', 'form frm', container)

    var group, label

    if (!this.options.settings) {
      group = L.DomUtil.create('div', 'form-group', this.form)
      label = L.DomUtil.create('label', '', group)
      label.innerHTML = 'JSON info'
      this.jsoninfo = L.DomUtil.create('textarea', 'form-control form-control-sm', group)
      this.jsoninfo.placeholder = 'json info'
      this.jsoninfo.value = this.options.data
        ? JSON.stringify(this.options.data, null, 2)
        : ''
      return container
    }
    this.inputs = {}
    _.map(this.options.settings, (i) => {
      group = L.DomUtil.create('div', 'form-group', this.form)
      if (i.l) {
        label = L.DomUtil.create('label', '', group)
        label.innerHTML = i.l
      }
      switch (i.t) {
        case 'text':
        case 'number':
          this.inputs[i.a] = L.DomUtil.create('input', 'form-control form-control-sm', group)
          this.inputs[i.a].type = i.t
          break
        case 'textarea':
          this.inputs[i.a] = L.DomUtil.create('textarea', 'form-control form-control-sm', group)
          break
      }
      // this.input.placeholder = this.options.placeholder
      this.inputs[i.a].value = this.options.data ? this.options.data[i.a] || '' : ''
    })

    L.DomEvent.disableClickPropagation(container)
    return container
  },
  onRemove: function (map) {
    // when removed
  }
})
