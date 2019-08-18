/* global location */
import queryString from 'query-string'

const val = queryString.parse(location.search)

const loc = window.location
const path = loc.protocol + '//' + loc.host + loc.pathname

function _update () {
  const stringified = queryString.stringify(val)
  window.history.replaceState(null, null, `${path}?${stringified}`)
}

export default {
  val,
  onZoomEnd: (evt) => {
    val.z = evt.target.getZoom()
    _update()
  },
  onMoveEnd: (evt) => {
    Object.assign(val, evt.target.getCenter())
    _update()
  }
}
