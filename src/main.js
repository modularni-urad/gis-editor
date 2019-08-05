/* global L */
// import { KROVAK } from './consts'
import EditablesStore from './stores/editables'
import EditControls from './editcontrols'

var map = L.map('map', {
  center: [49.414016, 14.658385],
  editable: true,
  zoom: 16,
  maxZoom: 20
  // crs: KROVAK
})

L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  maxZoom: 20,
  attribution: '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map)
// L.tileLayer.wms('http://geoportal.cuzk.cz/WMS_ORTOFOTO_PUB/WMService.aspx', {
//   layers: 'GR_ORTFOTORGB',
//   styles: '',
//   format: 'image/png',
//   transparent: true,
//   version: '1.3.0',
//   attribution: 'ČÚZK',
//   crs: KROVAK
// }).addTo(map)

const editControls = new EditControls({
  onSave: evt => {
    alert('save Clicked')
  },
  onDelete: evt => {
    alert('del Clicked')
  },
  onCancel: evt => {
    editablesStore.cancelEdit()
  }
})
editControls.addTo(map)

const drawnItems = L.featureGroup().addTo(map)

const tmp = L.featureGroup()

map.addControl(new L.Control.Draw({
  // edit: {
  //   featureGroup: tmp,
  //   poly: {
  //     allowIntersection: false
  //   }
  // },
  draw: {
    polygon: {
      allowIntersection: false,
      showArea: true
    },
    rectangle: false,
    circle: false,
    circlemarker: false
  }
}))

const editablesStore = new EditablesStore(drawnItems, tmp)
editablesStore.load(0)

map.on(L.Draw.Event.CREATED, editablesStore.onCreated.bind(editablesStore))
map.on('draw:edited', editablesStore.onEdited.bind(editablesStore))
