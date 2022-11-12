import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'

import InputUnit from '../components/InputUnit'

export default function CalculatorHR(props) {
  const hr = props.hr
  const deptSD = hr.SD * hr.SDs
  const deptDE = hr.DE * hr.DEs
  const deptDA = hr.DA * hr.DAs
  const deptEX = hr.EX * hr.EXs
  const costHR = deptSD + deptDE + deptDA + deptEX
  const savSD = deptSD * hr.savSD
  const savDE = deptDE * hr.savDE
  const savDA = deptDA * hr.savDA
  const savEX = deptEX * hr.savEX
  const saveHR = savSD + savDE + savDA + savEX

  return (
    <Paper style={{ width: '80%', margin: 'auto', display: 'flex', flexDirection: 'column', padding: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <TextField variant='filled' type='number' value={hr.SD} label='Software Developers' onChange={e => hr.setSD(e.target.value)} />
        <TextField variant='filled' type='number' value={hr.DE} label='DevOps Engineers' onChange={e => hr.setDE(e.target.value)} />
        <TextField variant='filled' type='number' value={hr.DA} label='Database Administrators' onChange={e => hr.setDA(e.target.value)} />
        <TextField variant='filled' type='number' value={hr.EX} label='IT Executives' onChange={e => hr.setEX(e.target.value)} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10 }}>
        <InputUnit variant='filled' label='SD Salary' value={hr.SDs} unit='k/yr' onChange={hr.setSDs} />
        <InputUnit variant='filled' label='DE Salary' value={hr.DEs} unit='k/yr' onChange={hr.setDEs} />
        <InputUnit variant='filled' label='DA Salary' value={hr.DAs} unit='k/yr' onChange={hr.setDAs} />
        <InputUnit variant='filled' label='EX Salary' value={hr.EXs} unit='k/yr' onChange={hr.setEXs} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10 }}>
        <InputUnit variant='standard' width={10} label='Dept Cost' value={deptSD} unit='k/yr' disabled={true} />
        <InputUnit variant='standard' width={10} label='Dept Cost' value={deptDE} unit='k/yr' disabled={true} />
        <InputUnit variant='standard' width={10} label='Dept Cost' value={deptDA} unit='k/yr' disabled={true} />
        <InputUnit variant='standard' width={10} label='Dept Cost' value={deptEX} unit='k/yr' disabled={true} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20 }}>
        <InputUnit variant='outlined' width={16} label='Total IT HR Cost' value={costHR} unit='k/yr' disabled={true} />
      </div>

      <br /><hr style={{ width: '100%' }} /><br />

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10 }}>
        <InputUnit variant='standard' width={8} label='SD Gain' value={hr.savSD * 100} unit='%' disabled={true} />
        <InputUnit variant='standard' width={8} label='DE Gain' value={hr.savDE * 100} unit='%' disabled={true} />
        <InputUnit variant='standard' width={8} label='DA Gain' value={hr.savDA * 100} unit='%' disabled={true} />
        <InputUnit variant='standard' width={8} label='EX Gain' value={hr.savEX * 100} unit='%' disabled={true} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10 }}>
        <InputUnit variant='standard' width={10} label='Dept Saved' value={savSD} unit='k/yr' disabled={true} />
        <InputUnit variant='standard' width={10} label='Dept Saved' value={savDE} unit='k/yr' disabled={true} />
        <InputUnit variant='standard' width={10} label='Dept Saved' value={savDA} unit='k/yr' disabled={true} />
        <InputUnit variant='standard' width={10} label='Dept Saved' value={savEX} unit='k/yr' disabled={true} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20 }}>
        <InputUnit variant='outlined' width={20} label='Total IT HR Saved' value={saveHR} unit='k/yr' disabled={true} />
      </div>
    </Paper>
  )
}