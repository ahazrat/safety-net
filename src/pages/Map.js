import { useEffect } from 'react'
import * as L from 'leaflet'

export default function Map(props) {

  const setMap = () => {
    var mapContainerId = 'mapdiv'
    var latlng = [51.505, -0.09]
    var container = L.DomUtil.get(mapContainerId);
    if (container != null) {
      container._leaflet_id = null;
    }
    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    var osmAttribution = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    var osmLayer = new L.TileLayer(osmUrl, { maxZoom: 18, attribution: osmAttribution })
    var map = new L.map(mapContainerId)
    map.setView(latlng, 13)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map)

    var marker = L.marker([51.5, -0.09]).addTo(map)
    var circle = L.circle([51.508, -0.11], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 500
    }).addTo(map);
    var polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047]
    ]).addTo(map);

    marker.bindPopup("<b>Hello citizen!</b><br>Protection Agent 2507<br><i>active</i>").openPopup();
    circle.bindPopup("Alert radius of ongoing event");
    polygon.bindPopup("Designated safety zone");

    // let map = new L.map('mapdiv')

    // map.remove()
  }

  useEffect(() => {
    setMap()
  }, [])

  return (
    <div>
      <h1>Map</h1>
      <div id='mapdiv' style={{ height: '100vh', marginTop: 30 }}></div>
    </div>
  )

}
