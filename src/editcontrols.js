/* global L */

export default L.Control.extend({
  options: {
    position: 'topleft'
    // 'topleft', 'topright', 'bottomleft', 'bottomright'
  },

  onAdd: function (map) {
    var container = L.DomUtil.create('div', 'leaflet-control leaflet-control-custom')

    var inner = L.DomUtil.create('div', 'leaflet-bar', container)

    this.save = L.DomUtil.create('a', 'leaflet-disabled', inner)
    this.save.innerHTML = '<i class="fas fa-save"></i>'
    this.cancel = L.DomUtil.create('a', 'leaflet-disabled', inner)
    this.cancel.innerHTML = '<i class="fas fa-undo"></i>'
    this.del = L.DomUtil.create('a', 'leaflet-disabled', inner)
    this.del.innerHTML = '<i class="fas fa-trash-alt"></i>'

    this.buttonsEnabled = false

    return container
  },

  onRemove: function (map) {
    // Nothing to do here
  },

  enableButtons: function () {
    L.DomUtil.removeClass(this.save, 'leaflet-disabled')
    L.DomEvent.addListener(this.save, 'click', this.options.onSave)
    L.DomUtil.removeClass(this.del, 'leaflet-disabled')
    L.DomEvent.addListener(this.del, 'click', this.options.onDelete)
    L.DomUtil.removeClass(this.cancel, 'leaflet-disabled')
    L.DomEvent.addListener(this.cancel, 'click', this.options.onCancel)
    this.buttonsEnabled = true
  },

  disableButtons: function () {
    L.DomUtil.addClass(this.save, 'leaflet-disabled')
    this.buttonsEnabled && L.DomEvent.removeListener(this.save, 'click', this.options.onSave)
    L.DomUtil.addClass(this.del, 'leaflet-disabled')
    this.buttonsEnabled && L.DomEvent.removeListener(this.del, 'click', this.options.onDelete)
    L.DomUtil.addClass(this.cancel, 'leaflet-disabled')
    this.buttonsEnabled && L.DomEvent.removeListener(this.cancel, 'click', this.options.onCancel)
    this.buttonsEnabled = false
  }
})
