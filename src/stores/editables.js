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
    e.target.off('click')
    e.target.setStyle({ fillColor: 'red', color: 'red' })
    e.target.editing.enable()
    if (this.edited) {
      this.cancelEdit()
    }
    this.edited = e.target
    this.origGeom = JSON.stringify(this.edited.getLatLngs())
    this.editForm.show(this.edited.data)
  }

  cancelEdit () {
    if (this.edited) {
      this.edited.editing.disable()
      this.edited.editing.initialize(this.edited)
      this.edited.setStyle({ fillColor: 'blue', color: 'blue' })
      this.edited.on('click', this.onSelect.bind(this))
      this.edited = null
      this.editForm.hide()
    }
  }

  cancel () {
    this.edited.setLatLngs(JSON.parse(this.origGeom))
    delete this.origGeom
    this.cancelEdit()
  }

  delete () {
    this.api.delete(`/${this.edited.data.id}`)
      .then(res => {
        this.layer.remove(this.edited)
        this.cancelEdit()
      })
  }

  save () {
    const data = this.editForm.form.getData()
    data.geom = this.edited.toGeoJSON().geometry
    this.api.post(`/polygons/${this.layerid}`, data)
  }

  onLoaded (data) {
    data.map(i => {
      const poly = new L.Polygon(WKT2leaflet(i.geom))
      poly.data = i
      poly.setStyle({ fillColor: 'blue', color: 'blue' })
      poly.on('click', this.onSelect.bind(this))
      this.layer.addLayer(poly)
      poly
        .bindTooltip(poly.data.title, { permanent: true, direction: 'center' })
        .openTooltip()
    })
  }

  onCreated (event) {
    var layer = event.layer
    layer.on('click', this.onSelect.bind(this))
    this.layer.addLayer(layer)
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

  // @observable menuDown = false
  //
  // @observable activeModal = null
  // @action closeModal () {
  //   this.activeModal = null
  //   delete this.modalStore
  // }
  // @action showModal (name, params) {
  //   this.activeModal = name
  //   this.modalStore = new modalMapping[name](this, params)
  // }
  //
  // @observable data = []
  // @observable loading = true
}
