/* global L, alert, $ */
import { KROVAK } from './consts'
import EditablesStore from './stores/editables'
import EditControls from './editcontrols'
import EditForm from './editform'
import APIService from './stores/apiService'
import query from './query'

function doLogin () {
  $('#loginModal').modal('show')
  $('#loginbutt').click(function () {
    var data = {
      uname: $('#l_uname').val(),
      passwd: $('#l_passwd').val()
    }
    api.login(data)
      .then(res => {
        initDrawingStuff()
        $('#loginModal').modal('hide')
        initDrawingStuff()
      })
      .catch(err => {
        alert(err)
      })
  })
}

const api = new APIService(doLogin)
api.get(`/layers/${query.val.layerid}`)
  .then(info => {
    if (!api.isLoggedIn()) {
      doLogin()
    } else {
      initDrawingStuff(info.settings)
    }
  })
  .catch(err => {
    if (err.response.status === 404) {
      return alert('Tato vrstva neexistuje. Máte špatný odkaz.')
    }
    alert(err)
  })

var map = L.map('map', {
  center: [query.val.lat || 49.414016, query.val.lng || 14.658385],
  editable: true,
  zoom: query.val.z || 16,
  maxZoom: 22,
  // crs: KROVAK
})
map.on('zoomend', query.onZoomEnd)
map.on('moveend', query.onMoveEnd)

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map)

// L.tileLayer.wms('http://geoportal.cuzk.cz/WMS_ORTOFOTO_PUB/WMService.aspx', {
//   layers: 'GR_ORTFOTORGB',
//   styles: '',
//   format: 'image/jpeg',
//   transparent: true,
//   version: '1.3.0',
//   attribution: 'ČÚZK',
//   crs: KROVAK
// }).addTo(map)

L.tileLayer('http://geoportal.cuzk.cz/WMTS_ORTOFOTO_900913/WMTService.aspx?service=WMTS&request=GetTile&version=1.0.0&layer=orto&style=default&format=image/png&TileMatrixSet=googlemapscompatibleext2:epsg:3857&TileMatrix={z}&TileRow={y}&TileCol={x}', {
  maxZoom: 22,
  maxNativeZoom: 18,
  attribution: 'WMTS - Ortofoto ČR | &copy ČÚZK <a href="http://www.cuzk.cz">www.cuzk.cz</a>'
}).addTo(map)

// L.tileLayer.wms('http://mapy.mutabor.cz/services/mapserver/common/kng-sec/gservice/wmts/1.0.0/pamm/default/EPSG:5514/', {
//   layers: 'GR_ORTFOTORGB',
//   styles: '',
//   format: 'image/png',
//   transparent: true,
//   version: '1.3.0',
//   attribution: 'ČÚZK',
//   crs: KROVAK
// }).addTo(map)

function initDrawingStuff (settings) {
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
      circle: false,
      marker: true,
      polyline: false,
      circlemarker: false
    }
  })
  map.addControl(drawControl)

  const editForm = new EditForm(map, settings)
  const drawnitems = L.featureGroup().addTo(map)

  const editablesStore = new EditablesStore(api, drawnitems, query.val.layerid, drawControl, editForm)
  editablesStore.load(query.val.layerid)

  const editControls = new EditControls({
    onSave: editablesStore.save.bind(editablesStore),
    onDelete: editablesStore.delete.bind(editablesStore),
    onCancel: editablesStore.cancel.bind(editablesStore)
  })
  editControls.addTo(map)

  // TODO: fix with proper event usage
  editablesStore.enableEditButt = () => {
    editControls.enableButtons()
  }
  editablesStore.disableEditButt = () => {
    editControls.disableButtons()
  }

  map.on(L.Draw.Event.CREATED, editablesStore.onCreated.bind(editablesStore))
  map.on('draw:edited', editablesStore.onEdited.bind(editablesStore))
}
