import * as React from 'react'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'

export default function RowRadioButtonsGroup(props) {
  const label = props['label']
  const options = props['options']
  const cb = props['cb']
  const value = props['value']

  return (
    <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">{label}</FormLabel>
      <RadioGroup
        row
        name="row-radio-buttons-group"
        value={value}
        onChange={e => {cb(e.target.value)}}
      >
        {options.map(text => (
          <FormControlLabel
            key={text}
            control={<Radio />}
            value={text}
            label={text}
          />
        ))}
        <FormControlLabel
          disabled
          control={<Radio />}
          value="ai"
          label="AI Agent"
        />
      </RadioGroup>
    </FormControl>
  )
}
