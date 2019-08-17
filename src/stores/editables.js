/* global L */
import WKT2leaflet from './wkt2leaflet'

export default class StateStore {
  //
  constructor (api, layer, layerid, drawControl, editForm) {
    this.layer = layer
    this.layerid = layerid
    this.api = api
    this.edited = null
    this.drawControl = drawControl
    this.editForm = editForm
    this.onSelectBound = this.onSelect.bind(this)
  }

  on401 (e) {
    return new Promise((resolve, reject) => {
      this.loginPromises.push(resolve)
    })
  }

  onLoggedIn () {
    this.loginPromises.map(resolve => resolve())
    this.loginPromises = []
    this.closeModal()
  }

  load (id) {
    this.api.get(`/polygons?layerid=${id}`).then(this.onLoaded.bind(this))
  }

  onSelect (e) {
    // this.drawControl.disable()
    this.layer.eachLayer(layer => {
      layer.off('click', this.onSelectBound)
    })
    e.target.off('click')
    e.target.setStyle({ fillColor: 'red', color: 'red' })
    e.target.editing.enable()
    this.edited = e.target
    this.origGeom = JSON.stringify(this.edited.getLatLngs())
    this.editForm.show(this.edited.data)
    this.enableEditButt()
  }

  cancelEdit () {
    this.edited.editing.disable()
    this.edited.editing.initialize(this.edited)
    this.edited.setStyle({ fillColor: 'blue', color: 'blue' })
    this.edited = null
    this.editForm.hide()
    this.layer.eachLayer(layer => {
      layer.on('click', this.onSelectBound)
    })
    this.disableEditButt()
  }

  cancel () {
    this.edited.setLatLngs(JSON.parse(this.origGeom))
    delete this.origGeom
    if (!this.edited.data.id) {
      this.layer.removeLayer(this.edited)
    }
    this.cancelEdit()
  }

  delete () {
    const id = this.edited.data.id
    this.api.delete(`/polygons/${this.layerid}/${id}`)
      .then(res => {
        this.layer.removeLayer(this.edited)
        this.cancelEdit()
      })
  }

  save () {
    const data = this.editForm.form.getData()
    data.geom = this.edited.toGeoJSON().geometry
    const id = this.edited.data.id
    let savePromise = null
    if (id) {
      savePromise = this.api.put(`/polygons/${this.layerid}/${id}`, data)
    } else {
      savePromise = this.api.post(`/polygons/${this.layerid}`, data)
    }
    savePromise.then(this.onSaved.bind(this))
  }

  onSaved (data) {
    this.cancelEdit()
  }

  onLoaded (data) {
    data.map(i => {
      const poly = new L.Polygon(WKT2leaflet(i.geom))
      poly.data = i
      poly.setStyle({ fillColor: 'blue', color: 'blue' })
      poly.on('click', this.onSelectBound)
      this.layer.addLayer(poly)
      poly
        .bindTooltip(poly.data.title, { permanent: true, direction: 'center' })
        .openTooltip()
    })
  }

  onCreated (event) {
    var layer = event.layer
    layer.data = {}
    this.layer.addLayer(layer)
    this.onSelect({ target: layer })
  }

  onEdited (e) {
    var layers = e.layers
    layers.eachLayer(layer => {
      layer.setStyle({ fillColor: 'blue', color: 'blue' })
    })
  }

  __ (str) {
    return str
  }
}
