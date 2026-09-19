// Chicago police district stations. Base: City of Chicago Data Portal
// "Police Stations" (data.cityofchicago.org/resource/z8bn-74gv), fetched 2026-09.
// Phones from chicago.gov CPD district pages; District 20 kept as Lincoln
// (chicagopolice.org); chicago.gov also labels that house Foster.
export const CHICAGO_POLICE_STATIONS = [
  { district: 'Headquarters', name: 'Headquarters', address: '3510 S Michigan Ave', lat: 41.830702, lng: -87.623395 },
  { district: '1', name: 'Central', address: '1718 S State St', lat: 41.858373, lng: -87.627356, phone: '312.745.4290' },
  { district: '2', name: 'Wentworth', address: '5101 S Wentworth Ave', lat: 41.801811, lng: -87.63056, phone: '312.747.8366' },
  { district: '3', name: 'Grand Crossing', address: '7040 S Cottage Grove Ave', lat: 41.766431, lng: -87.605748, phone: '312.747.8201' },
  { district: '4', name: 'South Chicago', address: '2255 E 103rd St', lat: 41.707933, lng: -87.568349, phone: '312.747.7581' },
  { district: '5', name: 'Calumet', address: '727 E 111th St', lat: 41.692723, lng: -87.604506, phone: '312.747.8210' },
  { district: '6', name: 'Gresham', address: '7808 S Halsted St', lat: 41.752137, lng: -87.644229, phone: '312.745.3617' },
  { district: '7', name: 'Englewood', address: '1438 W 63rd St', lat: 41.779632, lng: -87.660887, phone: '312.747.8223' },
  { district: '8', name: 'Chicago Lawn', address: '3420 W 63rd St', lat: 41.778987, lng: -87.708864, phone: '312.747.8730' },
  { district: '9', name: 'Deering', address: '3120 S Halsted St', lat: 41.837394, lng: -87.646408, phone: '312.747.8227' },
  { district: '10', name: 'Ogden', address: '3315 W Ogden Ave', lat: 41.856685, lng: -87.708382, phone: '312.747.7511' },
  { district: '11', name: 'Harrison', address: '3151 W Harrison St', lat: 41.873582, lng: -87.705488, phone: '312.746.8386' },
  { district: '12', name: 'Near West', address: '1412 S Blue Island Ave', lat: 41.862977, lng: -87.656973, phone: '312.746.8396' },
  { district: '14', name: 'Shakespeare', address: '2150 N California Ave', lat: 41.921103, lng: -87.697452, phone: '312.744.8290' },
  { district: '15', name: 'Austin', address: '5701 W Madison St', lat: 41.880083, lng: -87.7682, phone: '312.746.8303' },
  { district: '16', name: 'Jefferson Park', address: '5151 N Milwaukee Ave', lat: 41.974094, lng: -87.766149, phone: '312.742.4510' },
  { district: '17', name: 'Albany Park', address: '4650 N Pulaski Rd', lat: 41.966053, lng: -87.728115, phone: '312.742.4410' },
  { district: '18', name: 'Near North', address: '1160 N Larrabee St', lat: 41.903242, lng: -87.643352, phone: '312.742.5870' },
  { district: '19', name: 'Town Hall', address: '850 W Addison St', lat: 41.9474, lng: -87.651512, phone: '312.744.8320' },
  { district: '20', name: 'Lincoln', address: '5400 N Lincoln Ave', lat: 41.97955, lng: -87.692845, phone: '312.742.8714' },
  { district: '22', name: 'Morgan Park', address: '1900 W Monterey Ave', lat: 41.691435, lng: -87.66852, phone: '312.745.0570' },
  { district: '24', name: 'Rogers Park', address: '6464 N Clark St', lat: 41.999763, lng: -87.671324, phone: '312.744.5907' },
  { district: '25', name: 'Grand Central', address: '5555 W Grand Ave', lat: 41.918609, lng: -87.765574, phone: '312.746.8605' },
]

// Chicago fire houses. Base: City of Chicago Data Portal "Fire Stations"
// (data.cityofchicago.org/resource/28km-gtjn), fetched 2026-09, then hand-verified:
// E16 relocated to 53 E Pershing Rd; E18 is South (not North) Blue Island;
// added E2 marine, T24, CFD HQ, and OHare ARFF rescue stations.
export const CHICAGO_FIRE_STATIONS = [
  { name: 'E1', address: '419 S Wells St', lat: 41.876048, lng: -87.633337, units: 'E1 / AT1 / A41' },
  { name: 'E2', address: '250 N Breakwater Access', lat: 41.88765, lng: -87.61021, units: 'Marine Safety Station' },
  { name: 'E4', address: '548 W Division St', lat: 41.90399, lng: -87.642915 },
  { name: 'E5', address: '324 S Desplaines St', lat: 41.877028, lng: -87.644309 },
  { name: 'E7', address: '4911 W Belmont Ave', lat: 41.938785, lng: -87.749638 },
  { name: 'E8', address: '212 W Cermak Rd', lat: 41.853133, lng: -87.632357 },
  { name: 'E11', address: '5343 N Cumberland Ave', lat: 41.976856, lng: -87.836496 },
  { name: 'E13', address: '259 N Columbus Dr', lat: 41.886464, lng: -87.620614 },
  { name: 'E14', address: '1129 W Chicago Ave', lat: 41.895977, lng: -87.656225 },
  { name: 'E15', address: '8026 S Kedzie Ave', lat: 41.747475, lng: -87.70238 },
  { name: 'E16', address: '53 E Pershing Rd', lat: 41.82322, lng: -87.624217 },
  { name: 'E18', address: '1360 S Blue Island Ave', lat: 41.864482, lng: -87.655971 },
  { name: 'E19', address: '3421 S Calumet Ave', lat: 41.832278, lng: -87.617797 },
  { name: 'E22', address: '605 W Armitage Ave', lat: 41.91792, lng: -87.643967 },
  { name: 'E23', address: '1915 S Damen Ave', lat: 41.855619, lng: -87.675921 },
  { name: 'E26', address: '10 N Leavitt St', lat: 41.881516, lng: -87.681855 },
  { name: 'E28', address: '2534 S Throop St', lat: 41.845579, lng: -87.656333 },
  { name: 'E29', address: '3509 S Lowe Ave', lat: 41.830785, lng: -87.642132 },
  { name: 'E30', address: '1125 N Ashland Ave', lat: 41.902209, lng: -87.667079 },
  { name: 'E32', address: '5559 S Narragansett Ave', lat: 41.791236, lng: -87.781693 },
  { name: 'E34', address: '4034 W 47th St', lat: 41.8079, lng: -87.724851 },
  { name: 'E35', address: '1901 N Damen Ave', lat: 41.91623, lng: -87.677206 },
  { name: 'E38', address: '3949 W 16th St', lat: 41.858502, lng: -87.724276 },
  { name: 'E39', address: '1618 W 33rd Pl', lat: 41.833465, lng: -87.666351 },
  { name: 'E42', address: '55 W Illinois St', lat: 41.890802, lng: -87.630093 },
  { name: 'E43', address: '2179 N Stave St', lat: 41.920933, lng: -87.696442 },
  { name: 'E44', address: '412 N Kedzie Ave', lat: 41.888791, lng: -87.706578 },
  { name: 'E45', address: '4600 S Cottage Grove Ave', lat: 41.811343, lng: -87.606626 },
  { name: 'E46', address: '3027 E 93rd St', lat: 41.726412, lng: -87.550078 },
  { name: 'E47', address: '432 E Marquette Rd', lat: 41.773, lng: -87.614176 },
  { name: 'E49', address: '4401 S Ashland Ave', lat: 41.814042, lng: -87.664972 },
  { name: 'E50', address: '5000 S Union Ave', lat: 41.803448, lng: -87.642994 },
  { name: 'E54', address: '7101 S Parnell Ave', lat: 41.76526, lng: -87.638305 },
  { name: 'E55', address: '2718 N Halsted St', lat: 41.931797, lng: -87.648994 },
  { name: 'E56', address: '2214 W Barry Ave', lat: 41.937696, lng: -87.685766 },
  { name: 'E57', address: '1244 N Western Ave', lat: 41.903828, lng: -87.687132 },
  { name: 'E60', address: '1150 E 55th St', lat: 41.795152, lng: -87.597519 },
  { name: 'E62', address: '34 E 114th St', lat: 41.687406, lng: -87.624137 },
  { name: 'E63', address: '1440 E 67th St', lat: 41.773307, lng: -87.590202 },
  { name: 'E64', address: '7659 S Pulaski Rd', lat: 41.753006, lng: -87.721922 },
  { name: 'E65', address: '3002 W 42nd St', lat: 41.817297, lng: -87.699504 },
  { name: 'E68', address: '5258 W Grand Ave', lat: 41.917251, lng: -87.757473 },
  { name: 'E69', address: '4017 N Tripp Ave', lat: 41.953786, lng: -87.733929 },
  { name: 'E70/E59', address: '6030 N Clark St', lat: 41.991857, lng: -87.670234 },
  { name: 'E71', address: '6239 N California Ave', lat: 41.995147, lng: -87.69953 },
  { name: 'E72', address: '7974 S South Chicago Ave', lat: 41.749828, lng: -87.583412 },
  { name: 'E73', address: '8630 S Emerald Ave', lat: 41.736936, lng: -87.642455 },
  { name: 'E74', address: '10615 S Ewing Ave', lat: 41.702188, lng: -87.535229 },
  { name: 'E75', address: '11958 S State St', lat: 41.67673, lng: -87.622659 },
  { name: 'E76', address: '1747 N Pulaski Rd', lat: 41.912618, lng: -87.726381 },
  { name: 'E78', address: '1052 W Waveland Ave', lat: 41.949208, lng: -87.656405 },
  { name: 'E79', address: '6424 N Lehigh Ave', lat: 41.997975, lng: -87.766162 },
  { name: 'E80', address: '12701 S Doty Ave', lat: 41.6626, lng: -87.590597 },
  { name: 'E81', address: '10458 S Hoxie Ave', lat: 41.705334, lng: -87.560885 },
  { name: 'E82', address: '817 E 91st St', lat: 41.729333, lng: -87.604257 },
  { name: 'E83', address: '1200 W Wilson Ave', lat: 41.965639, lng: -87.659975 },
  { name: 'E84', address: '21 W 59th St', lat: 41.786898, lng: -87.626421 },
  { name: 'E86', address: '3918 N Harlem Ave', lat: 41.951143, lng: -87.807219 },
  { name: 'E88', address: '3637 W 59th St', lat: 41.785702, lng: -87.71469 },
  { name: 'E89', address: '3945 W Peterson Ave', lat: 41.990057, lng: -87.72568 },
  { name: 'E91', address: '2827 N Pulaski Rd', lat: 41.932237, lng: -87.726957 },
  { name: 'E92', address: '3112 W 111th St', lat: 41.691611, lng: -87.698919 },
  { name: 'E93', address: '330 W 104th St', lat: 41.705244, lng: -87.632433 },
  { name: 'E94', address: '5758 W Grace St', lat: 41.949448, lng: -87.770694 },
  { name: 'E95', address: '4003 W West End Ave', lat: 41.883344, lng: -87.725764 },
  { name: 'E96', address: '439 N Waller Ave', lat: 41.888324, lng: -87.767616 },
  { name: 'E97', address: '13359 S Burley Ave', lat: 41.652591, lng: -87.544704 },
  { name: 'E98', address: '202 E Chicago Ave', lat: 41.897065, lng: -87.622599 },
  { name: 'E99', address: '3042 S Kedvale Ave', lat: 41.837386, lng: -87.728061 },
  { name: 'E101', address: '2240 W 69th St', lat: 41.768394, lng: -87.679852 },
  { name: 'E102', address: '7340 N Clark St', lat: 42.01464, lng: -87.675024 },
  { name: 'E103', address: '25 S Laflin St', lat: 41.880716, lng: -87.664121 },
  { name: 'E104', address: '11641 S Avenue O', lat: 41.683848, lng: -87.540021 },
  { name: 'E106', address: '3401 N Elston Ave', lat: 41.943066, lng: -87.703214 },
  { name: 'E107', address: '1101 S California Ave', lat: 41.868107, lng: -87.695624 },
  { name: 'E108', address: '4625 N Milwaukee Ave', lat: 41.96465, lng: -87.757858 },
  { name: 'E109', address: '2358 S Whipple St', lat: 41.84834, lng: -87.701811 },
  { name: 'E110', address: '2322 W Foster Ave', lat: 41.975939, lng: -87.687584 },
  { name: 'E112', address: '3801 N Damen Ave', lat: 41.950755, lng: -87.678303 },
  { name: 'E113', address: '5212 W Harrison St', lat: 41.872983, lng: -87.755069 },
  { name: 'E115', address: '11940 S Peoria St', lat: 41.676768, lng: -87.644364 },
  { name: 'E116', address: '5955 S Ashland Ave', lat: 41.785691, lng: -87.664262 },
  { name: 'E117', address: '4900 W Chicago Ave', lat: 41.895037, lng: -87.748277 },
  { name: 'E119', address: '6030 N Avondale Ave', lat: 41.991207, lng: -87.798795 },
  { name: 'E120', address: '11035 S Homewood Ave', lat: 41.693206, lng: -87.668825 },
  { name: 'E121', address: '1724 W 95th St', lat: 41.721247, lng: -87.665763 },
  { name: 'E122', address: '101 E 79th St', lat: 41.750983, lng: -87.621352 },
  { name: 'E123', address: '2215 W 51st St', lat: 41.80117, lng: -87.679862 },
  { name: 'E124', address: '4426 N Kedzie Ave', lat: 41.961691, lng: -87.708293 },
  { name: 'E125', address: '2323 N Natchez Ave', lat: 41.922085, lng: -87.787754 },
  { name: 'E126', address: '7313 S Kingston Ave', lat: 41.762397, lng: -87.563936 },
  { name: 'E127', address: '5200 W 63rd St', lat: 41.777509, lng: -87.751975 },
  { name: 'E129', address: '8120 S Ashland Ave', lat: 41.746305, lng: -87.663462 },
  { name: 'T24', address: '10400 S Vincennes Ave', lat: 41.70473, lng: -87.65716, units: 'Truck 24 / A29' },
  { name: 'Headquarters', address: '3510 S Michigan Ave', lat: 41.8302, lng: -87.62386, units: 'CFD Headquarters' },
  { name: 'OHare R1 (E12)', address: 'O\'Hare Airport Rescue 1', lat: 41.9786, lng: -87.9048, units: 'E12 / TL63 / A26' },
  { name: 'OHare R2 (E10)', address: 'O\'Hare Airport Rescue 2', lat: 41.976, lng: -87.9, units: 'E10 / A16' },
  { name: 'OHare R3 (E9)', address: 'O\'Hare Airport Rescue 3', lat: 41.981, lng: -87.908, units: 'E9 / SQ7 / A59' },
]

export function chicagoPoliceStations() {
  return CHICAGO_POLICE_STATIONS
}

export function chicagoFireStations() {
  return CHICAGO_FIRE_STATIONS
}

function slugId(prefix, raw) {
  return prefix + '-' + String(raw).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

/** Police stations -> MapPin[] (kind: 'police'), for Map/leafletTemplate. */
export function policeStationPins(stations = CHICAGO_POLICE_STATIONS) {
  return stations.map(s => {
    const isHq = s.district === 'Headquarters'
    const label = isHq ? `CPD ${s.name}` : `CPD ${s.name} (District ${s.district})`
    const phone = s.phone ? ` · ${s.phone}` : ''
    return {
      lat: s.lat,
      lng: s.lng,
      kind: 'police',
      id: slugId('cpd', isHq ? 'hq' : s.district),
      title: `${label}: ${s.address}${phone}`,
    }
  })
}

/** Fire stations -> MapPin[] (kind: 'fire'), for Map/leafletTemplate. */
export function fireStationPins(stations = CHICAGO_FIRE_STATIONS) {
  return stations.map(s => {
    const units = s.units ? ` (${s.units})` : ''
    return {
      lat: s.lat,
      lng: s.lng,
      kind: 'fire',
      id: slugId('cfd', s.name),
      title: `CFD ${s.name}${units}: ${s.address}`,
    }
  })
}
