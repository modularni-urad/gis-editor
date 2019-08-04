/* global L */
// import { KROVAK } from './consts'
import EditablesStore from './stores/editables'

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

const drawnItems = L.featureGroup().addTo(map)

const editablesStore = new EditablesStore(drawnItems)

editablesStore.load(0)

map.on(L.Draw.Event.CREATED, function (event) {
  var layer = event.layer

  drawnItems.addLayer(layer)
})
