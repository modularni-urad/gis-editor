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

// TODO: disable when editing
// https://github.com/Leaflet/Leaflet.draw/issues/401
// https://github.com/Leaflet/Leaflet.draw/issues/315#issuecomment-104233372
const drawControl = new L.Control.Draw({
  draw: {
    polygon: {
      allowIntersection: false,
      showArea: true
    },
    rectangle: false,
    circle: false
    // circlemarker: false
  }
})
map.addControl(drawControl)

const drawnItems = L.featureGroup().addTo(map)

const editablesStore = new EditablesStore(drawnItems, drawControl)
editablesStore.load(0)

const editControls = new EditControls({
  onSave: editablesStore.save.bind(editablesStore),
  onDelete: editablesStore.delete.bind(editablesStore),
  onCancel: editablesStore.cancelEdit.bind(editablesStore)
})
editControls.addTo(map)

map.on(L.Draw.Event.CREATED, editablesStore.onCreated.bind(editablesStore))
map.on('draw:edited', editablesStore.onEdited.bind(editablesStore))
