import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import * as L from 'leaflet'

import logo from '../images/shield-icon.webp'

export default function Home(props) {

  useEffect(() => {
    var latlng = [51.505, -0.09]
    var container = L.DomUtil.get('map');
    if (container != null) {
      container._leaflet_id = null;
    }
    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      osmAttribution = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
      osmLayer = new L.TileLayer(osmUrl, { maxZoom: 18, attribution: osmAttribution }),
      map = new L.map('map')
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

    map.setView([latlng[0], latlng[1] + 0.2], map.getZoom(), {
      "animate": true,
      "pan": {
        "duration": 20
      }
    });

  })

  return (
    <div>
      <img src={logo} className='App-logo' alt='logo' />

      <p>Welcome to <code>Safety Net</code></p>
      <p>A decentralized marketplace for security</p>

      <Stack spacing={2} direction='row' style={{ justifyContent: 'center', marginTop: 40 }}>
        <Link to='/services'><Button variant='contained'>Request</Button></Link>
        <Link to='/services'><Button variant='outlined'>Provide</Button></Link>
      </Stack>

      <div id='map' style={{ height: 400, marginTop: 30 }}></div>

    </div>
  )
}
