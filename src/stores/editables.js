/* global L */
import APIService from './apiService'
// import LoginStore from './view/login'
// import PermsEditStore from './permsEdit'

export default class StateStore {
  //
  constructor (layer) {
    this.layer = layer
    this.api = new APIService(this.on401.bind(this))
    this.edited = null
  }

  // formatDate (d) {
  //   return moment(d).format('DD.MM.YYYY')
  // }

  on401 (e) {
    // this.activeModal !== MODAL_NAMES.LOGIN && this.showModal(MODAL_NAMES.LOGIN)
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

  onLoaded (data) {
    const polygon = new L.Polygon([
      [49.414016, 14.658385],
      [49.41, 14.658385],
      [49.414016, 14.65]
    ])
    polygon.on('click', e => {
      e.target.setStyle({ fillColor: 'red', color: 'red' })
      e.target.editing.enable()
      this.edited = e.target
    })
    this.layer.addLayer(polygon)
    polygon
      .bindTooltip('My polygon', { permanent: true, direction: 'center' })
      .openTooltip()
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
