import { useState } from 'react'

import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'

import RowRadioButtonsGroup from '../components/RadioRow'
import CalculatorHR from './CalculatorHR'

export default function Calcualtor(props) {
  const profiles = {
    'Sole Developer': {
      'HR': { 'SD': 10, 'DE': 2, 'DA': 1, 'EX': 1, SDs: 150, DEs: 180, DAs: 130, EXs: 200, savSD: 0.1, savDE: 0.6, savDA: 0.2, savEX: 0.05 }
    },
    'Small Business': {
      'HR': { 'SD': 10, 'DE': 2, 'DA': 1, 'EX': 1, SDs: 150, DEs: 180, DAs: 130, EXs: 200, savSD: 0.1, savDE: 0.6, savDA: 0.2, savEX: 0.05 }
    },
    'App / Platform': {
      'HR': { 'SD': 50, 'DE': 4, 'DA': 4, 'EX': 2, SDs: 160, DEs: 220, DAs: 150, EXs: 280, savSD: 0.12, savDE: 0.65, savDA: 0.25, savEX: 0.03 }
    },
    'Other': {
      'HR': { 'SD': 3, 'DE': 0.5, 'DA': 0.5, 'EX': 0, SDs: 60, DEs: 80, DAs: 50, EXs: 0, savSD: 0.1, savDE: 0.6, savDA: 0.2, savEX: 0.05 }
    },
  }
  const [profile, setProfile] = useState(Object.keys(profiles)[1])

  // HR
  const [SD, setSD] = useState(profiles[profile].HR['SD'])
  const [DE, setDE] = useState(profiles[profile].HR['DE'])
  const [DA, setDA] = useState(profiles[profile].HR['DA'])
  const [EX, setEX] = useState(profiles[profile].HR['EX'])
  const [SDs, setSDs] = useState(profiles[profile].HR['SDs'])
  const [DEs, setDEs] = useState(profiles[profile].HR['DEs'])
  const [DAs, setDAs] = useState(profiles[profile].HR['DAs'])
  const [EXs, setEXs] = useState(profiles[profile].HR['EXs'])
  const savSD = profiles[profile].HR['savSD']
  const savDE = profiles[profile].HR['savDE']
  const savDA = profiles[profile].HR['savDA']
  const savEX = profiles[profile].HR['savEX']
  const hr = { SD, setSD, DE, setDE, DA, setDA, EX, setEX, SDs, setSDs, DEs, setDEs, DAs, setDAs, EXs, setEXs, savSD, savDE, savDA, savEX }
  const setProfile1 = e => {
    setProfile(e)
    setSD(profiles[e].HR['SD'])
    setDE(profiles[e].HR['DE'])
    setDA(profiles[e].HR['DA'])
    setEX(profiles[e].HR['EX'])
    setSDs(profiles[e].HR['SDs'])
    setDEs(profiles[e].HR['DEs'])
    setDAs(profiles[e].HR['DAs'])
    setEXs(profiles[e].HR['EXs'])
  }


  // Infra
  const [numOfApps, setNumOfApps] = useState(1)
  const [numOfServ, setNumOfServ] = useState(3)
  const [numOfDBs, setNumOfDBs] = useState(2)
  const [numOfAPIs, setNumOfAPIs] = useState(1)

  const [costApp, setCostApp] = useState(200)
  const [costSrv, setCostSrv] = useState(400)
  const [costDBs, setCostDBs] = useState(150)
  const [costAPI, setCostAPI] = useState(175)

  // Expected Monthly Savings (ems)
  const emsApps = numOfApps * 100
  const emsServ = numOfServ * 300
  const emsDBs = numOfDBs * 200
  const emsAPIs = numOfAPIs * 500
  const emsTotal = emsApps + emsServ + emsDBs + emsAPIs

  return (
    <div style={{ backgroundColor: '#556', padding: 30 }}>
      <h1>Value Calculator</h1>
      <RowRadioButtonsGroup
        label='Select Profile'
        options={Object.keys(profiles)}
        value={profile}
        cb={setProfile1}
      />
      <p>{profile}</p>

      {profile !== 'Sole Developer' ? <CalculatorHR hr={hr} /> : null}

      <br />

      <Paper style={{ width: '80%', margin: 'auto', display: 'flex', flexDirection: 'column', padding: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20 }}>
          <TextField variant='filled' type='number' value={numOfApps} label='Apps' onChange={e => setNumOfApps(e.target.value)} />
          <TextField variant='filled' type='number' value={numOfServ} label='Services' onChange={e => setNumOfServ(e.target.value)} />
          <TextField variant='filled' type='number' value={numOfDBs} label='Databases' onChange={e => setNumOfDBs(e.target.value)} />
          <TextField variant='filled' type='number' value={numOfAPIs} label='APIs' onChange={e => setNumOfAPIs(e.target.value)} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <TextField variant='filled' type='number' value={costApp} label='$/app/mo' onChange={e => setCostApp(e.target.value)} />
          <TextField variant='filled' type='number' value={costSrv} label='$/service/mo' onChange={e => setCostSrv(e.target.value)} />
          <TextField variant='filled' type='number' value={costDBs} label='$/db/mo' onChange={e => setCostDBs(e.target.value)} />
          <TextField variant='filled' type='number' value={costAPI} label='$/api/mo' onChange={e => setCostAPI(e.target.value)} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20 }}>
          <TextField disabled variant='standard' type='number' value={((numOfApps * costApp) + (numOfServ * costSrv) + (numOfDBs * costDBs) + (numOfAPIs * costAPI)) * 12 / 1000} label='IT HW Cost ($k/yr)' />
        </div>

        <br /><hr style={{ width: '100%' }} /><br />

        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10 }}>
          <TextField disabled variant='standard' type='number' value={0.15} label='Est Savings' />
          <TextField disabled variant='standard' type='number' value={0.20} label='Est Savings' />
          <TextField disabled variant='standard' type='number' value={0.05} label='Est Savings' />
          <TextField disabled variant='standard' type='number' value={0.25} label='Est Savings' />
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10 }}>
          <TextField disabled variant='standard' type='number' value={numOfApps * costApp * 0.15} label='Dept Savings' />
          <TextField disabled variant='standard' type='number' value={numOfServ * costSrv * 0.20} label='Dept Savings' />
          <TextField disabled variant='standard' type='number' value={numOfDBs * costDBs * 0.05} label='Dept Savings' />
          <TextField disabled variant='standard' type='number' value={numOfAPIs * costAPI * 0.25} label='Dept Savings' />
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20 }}>
          <TextField disabled variant='standard' type='number' value={((numOfApps * costApp * 0.15) + (numOfServ * costSrv * 0.20) + (numOfDBs * costDBs * 0.05) + (numOfAPIs * costAPI * 0.25)) * 12 / 1000} label='IT HR Savings ($k/yr)' />
        </div>
      </Paper>

      {profile && (numOfApps || numOfServ || numOfDBs || numOfAPIs) ?
        <div>
          <h1>Total Expected Montly Savings</h1>
          <p>${emsTotal} per month</p>
        </div>
        : null}
    </div>
  )
}
