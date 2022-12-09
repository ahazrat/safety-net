function toRad(Value) {
  // Converts numeric degrees to radians
  return Value * Math.PI / 180
}

function calcCrow(p1, p2) {
  // Takes two points (LatLng)
  // Returns distance between them as the crow flies (in km)
  const lat1 = p1[0]
  const lon1 = p1[1]
  const lat2 = p2[0]
  const lon2 = p2[1]

  const R = 6371 // km
  const dLat = toRad(lat2-lat1)
  const dLon = toRad(lon2-lon1)
  const lat1Rad = toRad(lat1)
  const lat2Rad = toRad(lat2)

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1Rad) * Math.cos(lat2Rad) 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) 
  const d = R * c
  return d.toFixed(2)
}

export { calcCrow }
