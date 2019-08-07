/* global L */
import APIService from './apiService'

export default class StateStore {
  //
  constructor (layer, drawControl) {
    this.layer = layer
    this.api = new APIService(this.on401.bind(this))
    this.edited = null
    this.drawControl = drawControl
  }

  on401 (e) {
    alert('error 401: you need to login!')
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
    // this.loadFolderContent(null)
    setTimeout(this.onLoaded.bind(this), 1000)
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
  }

  cancelEdit () {
    if (this.edited) {
      this.edited.editing.disable()
      this.edited.setStyle({ fillColor: 'blue', color: 'blue' })
      this.edited.on('click', this.onSelect.bind(this))
      this.edited = null
    }
  }

  delete () {

  }

  save () {

  }

  onLoaded (data) {
    const polygon = new L.Polygon([
      [49.414016, 14.658385],
      [49.41, 14.658385],
      [49.414016, 14.65]
    ])
    polygon.on('click', this.onSelect.bind(this))
    this.layer.addLayer(polygon)
    polygon
      .bindTooltip('My polygon', { permanent: true, direction: 'center' })
      .openTooltip()
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
