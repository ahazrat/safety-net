import { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'
import { faker } from '@faker-js/faker'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'

import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'

import { getCollection, createNewDoc, deleteDocument } from '../components/Firebase'
import RowRadioButtonsGroup from '../components/RadioRow'

function createNewListing() {
  const newListing = {
    createdAt: faker.datatype.datetime({ min: 1577836800000, max: Date.now() }),
    jobTitle: faker.name.jobTitle(),
    userName: faker.internet.userName(),
    fullName: faker.name.fullName(),
    imgSrc: faker.image.people(),
    city: faker.address.city(),
    jobTitle: faker.name.jobTitle(),
    btcAdd: faker.finance.bitcoinAddress(),
  }
  createNewDoc('listings', newListing)
}

function validateListing(l) {
  if (!('btcAdd' in l)) { return false }
  if (!('createdTs' in l)) { return false }
  return true
}

function ListingsArr({ listings }) {
  return (
    <Stack style={{ height: '170vh', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', alignContent: 'space-around' }}>
      {listings.map((l, i) => {
        const bgc = validateListing(l) ? 'green' : 'red'
        let createdAt = ''
        if (l.createdTs) {
          createdAt = new Date(l.createdTs.seconds).toISOString().substring(0, 19)
        }
        return (
          <Card key={i} style={{ height: 150, width: '45%', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', backgroundColor: bgc }}>
            <Avatar alt={l.fullName} src={l.imgSrc} style={{ height: 90, width: 90 }} />
            <div>
              <h5>{l.fullName}</h5>
              <p>{l.city}</p>
            </div>
            <div style={{ fontSize: 'small' }}>
              <p>{l.jobTitle}</p>
              <p>ID: {l.id}</p>
              <p>Created at: {createdAt}</p>
            </div>
            <Button variant='filled' startIcon={<DeleteIcon />} onClick={()=>{
              console.log(l.id)
            }}>
              Delete
            </Button>
          </Card>
        )
      })}
    </Stack>
  )
}

export default function Listings(props) {

  const [listings, setListings] = useState([])

  useEffect(() => {
    // createNewListing()
    getCollection('listings').then(ls => setListings(ls))
  }, [])


  const profiles = {
    'Neighborhood Watch': {
    },
    'Event Security': {
    },
    'Physical Defense': {
    },
    'Safe Rides': {
    },
  }
  const [profile, setProfile] = useState(Object.keys(profiles)[1])

  return (
    <div style={{ backgroundColor: '#556', padding: 30 }}>
      <h1>Listings</h1>

      <RowRadioButtonsGroup
        label='Select Profile'
        options={Object.keys(profiles)}
        value={profile}
      />


      <p>{profile}</p>

      <br />

      {listings instanceof Array && listings.length > 0 ?
        <ListingsArr listings={listings} /> : null
      }

      <div>
        <h1>Total Number of Listings</h1>
        <p>{listings.length} listings</p>
      </div>
    </div>
  )
}
