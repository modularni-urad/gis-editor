/* global L */

export default L.Control.extend({
  options: {
    position: 'topleft'
    // 'topleft', 'topright', 'bottomleft', 'bottomright'
  },

  onAdd: function (map) {
    var container = L.DomUtil.create('div', 'leaflet-control leaflet-control-custom')

    var inner = L.DomUtil.create('div', 'leaflet-bar', container)

    var save = L.DomUtil.create('a', '', inner)
    var cancel = L.DomUtil.create('a', '', inner)
    var del = L.DomUtil.create('a', '', inner)

    L.DomEvent.addListener(save, 'click', this.options.onSave)
    L.DomEvent.addListener(del, 'click', this.options.onDelete)
    L.DomEvent.addListener(cancel, 'click', this.options.onCancel)

    return container
  },

  onRemove: function (map) {
    // Nothing to do here
  }
})
