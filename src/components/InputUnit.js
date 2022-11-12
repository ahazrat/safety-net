import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

export default function InputUnit({ variant, width, label, value, unit, onChange, disabled }) {
    if (!width) {
        width = 13
    }
    let inputProps = {
      endAdornment: <InputAdornment position='end'>{unit}</InputAdornment>,
    }
    if (unit === 'k/yr') {
      inputProps['startAdornment'] = <InputAdornment position='start'>$</InputAdornment>
    }
    return (
      <TextField
        disabled={disabled}
        variant={variant}
        type='number'
        size='small'
        sx={{ width: width+'ch' }}
        InputProps={inputProps}
        value={value}
        label={label}
        onChange={e => onChange(e.target.value)}
      />
    )
  }
