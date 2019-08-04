/* global L */

export const KROVAK = new L.Proj.CRS('EPSG:5514', '+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=589,76,480,0,0,0,0 +units=m +no_defs', {
  origin: [-951499.37, -930499.37],
  resolutions: [
    4891.96999883583 * 64,
    4891.96999883583 * 32,
    4891.96999883583 * 16,
    4891.96999883583 * 8,
    4891.96999883583 * 4,
    4891.96999883583 * 2,
    4891.96999883583,
    2445.98499994708,
    1222.99250010583,
    611.496250052917,
    305.748124894166,
    152.8740625,
    76.4370312632292,
    38.2185156316146,
    19.1092578131615,
    9.55462890525781,
    4.77731445262891,
    2.38865722657904,
    1.19432861315723,
    0.597164306578613,
    0.298582153289307
  ]
})
