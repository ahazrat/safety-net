import { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import { faker } from '@faker-js/faker'
import { collection, addDoc } from "firebase/firestore"

import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'

import { db, getListings } from '../components/Firebase'
import RowRadioButtonsGroup from '../components/RadioRow'
import { async } from '@firebase/util'

function Listing() {
  const fullName = faker.name.fullName()
  const imgSrc = faker.image.people()
  const city = faker.address.city()
  const jobTitle = faker.name.jobTitle()
  const btcAdd = faker.finance.bitcoinAddress()
  return (
    <Card style={{ height: 100, width: '50%', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
      <Avatar alt={fullName} src={imgSrc} style={{ height: 90, width: 90 }} />
      <div>
        <h5>{fullName}</h5>
        <p>{city}</p>
      </div>
      <div>
        <p>{jobTitle}</p>
        <p>{btcAdd}</p>
      </div>
    </Card>
  )
}

function ImageAvatars() {
  const listings = [1, 2, 3, 4]
  return (
    <Stack direction='column' spacing={2}>
      {listings.map(i => {
        return (
          <Listing key={i} />
        )
      })}
    </Stack>
  )
}

export default function Listings(props) {

  const [listings, setListings] = useState([])

  const createNewDoc = async () => {
    const docRef = await addDoc(collection('listings', db, 'listings'), {
      fullName: faker.name.fullName(),
      imgSrc: faker.image.people(),
      city: faker.address.city(),
      jobTitle: faker.name.jobTitle(),
      btcAdd: faker.finance.bitcoinAddress(),
    })
    console.log("Document written with ID: ", docRef.id);

  }
  
  useEffect(() => {
    // getListings()
    createNewDoc()
  }, [])
  

  const profiles = {
    'Neighborhood Watch': {
      'HR': { 'SD': 10, 'DE': 2, 'DA': 1, 'EX': 1, SDs: 150, DEs: 180, DAs: 130, EXs: 200, savSD: 0.1, savDE: 0.6, savDA: 0.2, savEX: 0.05 }
    },
    'Event Security': {
      'HR': { 'SD': 10, 'DE': 2, 'DA': 1, 'EX': 1, SDs: 150, DEs: 180, DAs: 130, EXs: 200, savSD: 0.1, savDE: 0.6, savDA: 0.2, savEX: 0.05 }
    },
    'Physical Defense': {
      'HR': { 'SD': 50, 'DE': 4, 'DA': 4, 'EX': 2, SDs: 160, DEs: 220, DAs: 150, EXs: 280, savSD: 0.12, savDE: 0.65, savDA: 0.25, savEX: 0.03 }
    },
    'Safe Rides': {
      'HR': { 'SD': 3, 'DE': 0.5, 'DA': 0.5, 'EX': 0, SDs: 60, DEs: 80, DAs: 50, EXs: 0, savSD: 0.1, savDE: 0.6, savDA: 0.2, savEX: 0.05 }
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

      <ImageAvatars />

      <div>
        <h1>Total Number of Listings</h1>
        <p>{listings.length} listings</p>
      </div>
    </div>
  )
}
