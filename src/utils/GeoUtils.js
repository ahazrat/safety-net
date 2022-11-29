function toRad(Value) {
  // Converts numeric degrees to radians
  return Value * Math.PI / 180
}

function calcCrow(p1, p2) {
  // Takes two points (LatLng)
  // Returns distance between them as the crow flies (in km)

  var lat1 = p1[0]
  var lon1 = p1[1]
  var lat2 = p2[0]
  var lon2 = p2[1]

  var R = 6371 // km
  var dLat = toRad(lat2-lat1)
  var dLon = toRad(lon2-lon1)
  var lat1 = toRad(lat1)
  var lat2 = toRad(lat2)

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2) 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) 
  var d = R * c
  return d.toFixed(2)
}

export { calcCrow }
