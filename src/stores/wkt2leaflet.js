/* global _, L */
import WKT from 'terraformer-wkt-parser'

// function sameCoords (c1, c2) {
//   return c1[0] === c2[0] && c1[1] === c2[1]
// }
//
// function trunc (coords) {
//   var i
//   var verts = []
//
//   for (i = 0; i < coords.length; i += 1) {
//     if (_.isArray(coords[i])) {
//       verts.push(trunc(coords[i]))
//     } else {
//       // Add the first coord, but skip the last if it is identical
//       if (i === 0 || !sameCoords(coords[0], coords[i])) {
//         verts.push(coords[i])
//       }
//     }
//   }
//
//   return verts
// }

function omitLastANdReverseCoords (arr) {
  const rv = []
  for (var i = 0; i < arr.length - 1; i++) {
    rv.push([arr[i][1], arr[i][0]])
  }
  return rv
}

export default function (wktString) {
  const wkt = WKT.parse(wktString)
  switch (wkt.type) {
    case 'Polygon':
      return [omitLastANdReverseCoords(wkt.coordinates[0])]
  }
}
