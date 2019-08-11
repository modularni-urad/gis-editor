/* global L, location */
// import { KROVAK } from './consts'
import EditablesStore from './stores/editables'
import EditControls from './editcontrols'
import EditForm from './editform'
import APIService from './stores/apiService'

const api = new APIService()
const pars = location.search.split('layer=')
const layerId = pars.length > 0 ? pars[1] : 'unknown'
api.get(`/layers/${layerId}`)
  .then(info => {
    initDrawingStuff()
  })

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

function initDrawingStuff () {
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

  const editForm = new EditForm(map)
  const drawnitems = L.featureGroup().addTo(map)

  const editablesStore = new EditablesStore(api, drawnitems, layerId, drawControl, editForm)
  editablesStore.load(layerId)

  const editControls = new EditControls({
    onSave: editablesStore.save.bind(editablesStore),
    onDelete: editablesStore.delete.bind(editablesStore),
    onCancel: editablesStore.cancel.bind(editablesStore)
  })
  editControls.addTo(map)

  map.on(L.Draw.Event.CREATED, editablesStore.onCreated.bind(editablesStore))
  map.on('draw:edited', editablesStore.onEdited.bind(editablesStore))
}
