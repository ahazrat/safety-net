import { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'
import { faker } from '@faker-js/faker'
// import CardActions from '@mui/material/CardActions'
// import CardContent from '@mui/material/CardContent'

import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'

import { getCollection, createNewDoc, deleteDocument } from '../components/Firebase'
import RowRadioButtonsGroup from '../components/RadioRow'

function createNewListing() {
  const userName = faker.internet.userName()
  // const newTs1 = faker.datatype.datetime({ min: 1577836800000, max: Date.now() })
  const newTs2 = new Date(Date.now())
  let newListing = {
    createdAt: newTs2,
    jobTitle: faker.name.jobTitle(),
    userName: userName,
    fullName: faker.name.fullName(),
    city: faker.address.city(),
    btcAdd: faker.finance.bitcoinAddress(),
  }
  fetch('https://loremflickr.com/640/480/people')
    .then(r => {
      console.log('fetched userImage url:', r.url)
      newListing['userImage'] = r.url
      createNewDoc('listings', newListing)
    })
}

function validateListing(l) {
  if (!('createdAt' in l)) { return 'red' }
  if (!('userImage' in l)) { return 'red' }
  if (l.userImage === 'https://loremflickr.com/640/480/people') { return 'red' }
  if (typeof l.createdAt === 'number') { return '#0F8' }
  if (0) { return 'red' }
  return 'green'
}

function ListingsArr({ listings }) {
  return (
    <Stack style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', alignContent: 'space-around' }}>
      {listings.map((l, i) => {
        let createdAt = ''
        if (l.createdAt) {
          if (typeof l.createdAt === 'number') {
            // createdAt = l.createdAt
            createdAt = (new Date(l.createdAt)).toISOString().substring(0, 19)
          }
          if (typeof l.createdAt === 'object') {
            createdAt = (new Date(l.createdAt.seconds)).toISOString().substring(0, 19)
          }
        }

        return (
          <Card key={i} style={{ height: 150, width: '45%', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', backgroundColor: validateListing(l), margin: 5 }}>
            <Avatar alt={l.fullName} src={l.userImage} style={{ height: 90, width: 90 }} />
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
              deleteDocument('listings', l.id)
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

      <p>{listings.length} listings</p>
      {listings instanceof Array && listings.length > 0 ?
        <ListingsArr listings={listings} /> : null
      }

    </div>
  )
}
