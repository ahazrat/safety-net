import { Link } from 'react-router-dom'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'

import logo from '../images/shield-icon.webp'

export default function Home(props) {
  return (
    <div>
      <img src={logo} className='App-logo' alt='logo' />

      <p>Welcome to <code>Safety Net</code></p>
      <p>A decentralized marketplace for security</p>

      <Stack spacing={2} direction='row' style={{ justifyContent: 'center', marginTop: 40 }}>
        <Link to='/services'><Button variant='contained'>Request</Button></Link>
        <Link to='/services'><Button variant='outlined'>Provide</Button></Link>
      </Stack>


    </div>
  )
}
