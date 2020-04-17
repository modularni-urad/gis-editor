/* global L */
import WKT2leaflet from './wkt2leaflet'

export default class StateStore {
  //
  constructor (api, layer, layerid, drawControl, editForm, doLogin) {
    this.layer = layer
    this.layerid = layerid
    this.api = api
    this.edited = null
    this.doLogin = doLogin
    this.drawControl = drawControl
    this.editForm = editForm
    this.onSelectBound = this.onSelect.bind(this)
    this.onErrorBound = this.onError.bind(this)
  }

  onError (e) {
    if (e.status === 401) {
      return this.doLogin()
    }
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
    this.api.get(`/objs?layerid=${id}`).then(this.onLoaded.bind(this))
  }

  onSelect (e) {
    // this.drawControl.disable()
    this.layer.eachLayer(layer => {
      layer.off('click', this.onSelectBound)
    })
    e.target.off('click')
    e.target.setStyle && e.target.setStyle({ fillColor: 'red', color: 'red' })
    e.target.editing.enable()
    this.edited = e.target
    const orig = this.edited.getLatLngs ? this.edited.getLatLngs() : this.edited.getLatLng()
    this.origGeom = JSON.stringify(orig)
    this.editForm.show(this.edited.data.properties)
    this.enableEditButt()
  }

  cancelEdit () {
    this.edited.editing.disable()
    this.edited.editing.initialize(this.edited)
    this.edited.setStyle && this.edited.setStyle({ fillColor: 'blue', color: 'blue' })
    this.edited = null
    this.editForm.hide()
    this.layer.eachLayer(layer => {
      layer.on('click', this.onSelectBound)
    })
    this.disableEditButt()
  }

  cancel () {
    this.edited.setLatLngs && this.edited.setLatLngs(JSON.parse(this.origGeom))
    delete this.origGeom
    if (!this.edited.data.id) {
      this.layer.removeLayer(this.edited)
    }
    this.cancelEdit()
  }

  delete () {
    const id = this.edited.data.id
    this.api.delete(`/objs/${this.layerid}/${id}`)
      .then(res => {
        this.layer.removeLayer(this.edited)
        this.cancelEdit()
      })
      .catch(this.onErrorBound)
  }

  save () {
    this.savingdata = this.editForm.form.getData()
    const id = this.edited.data.id
    let savePromise = null
    if (id) {
      savePromise = this.api.put(`/objs/${this.layerid}/${id}`, {
        geometry: this.edited.toGeoJSON().geometry,
        properties: this.savingdata
      })
    } else {
      savePromise = this.api.post(`/objs/${this.layerid}`, {
        type: 'Feature',
        geometry: this.edited.toGeoJSON().geometry,
        properties: this.savingdata
      })
    }
    savePromise.then(this.onSaved.bind(this)).catch(this.onErrorBound)
  }

  onSaved (data) {
    Object.assign(this.edited.data, this.savingdata)
    delete this.savingdata
    this.cancelEdit()
  }

  onLoaded (data) {
    data.map(i => {
      if (i.polygon) {
        const poly = new L.Polygon(WKT2leaflet(i.polygon))
        poly.data = i
        poly.setStyle({ fillColor: 'blue', color: 'blue' })
        poly.on('click', this.onSelectBound)
        this.layer.addLayer(poly)
        poly
          .bindTooltip(poly.data.title, { permanent: true, direction: 'center' })
          .openTooltip()
      } else if (i.point) {
        const poly = new L.Marker(WKT2leaflet(i.point))
        poly.data = i
        // poly.setStyle({ fillColor: 'blue', color: 'blue' })
        poly.on('click', this.onSelectBound)
        this.layer.addLayer(poly)
      }
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
