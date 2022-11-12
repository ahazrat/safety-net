import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import * as L from 'leaflet'

import logo from '../images/shield-icon.webp'

export default function Home(props) {

  useEffect(() => {
    var container = L.DomUtil.get('map');
    if (container != null) {
      container._leaflet_id = null;
    }
    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      osmAttribution = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,' +
        ' <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
      osmLayer = new L.TileLayer(osmUrl, { maxZoom: 18, attribution: osmAttribution });

    var map = new L.map('map')
    map.setView([51.505, -0.09], 13)
    // map.setView(new L.LatLng(51.505, -0.09), 9 );
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map)
  })

  const setMap = () => {

    // map = L.map('map').setView([51.505, -0.09], 13)
    // map.remove()
  }

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
