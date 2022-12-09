import { useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

export default function Register(props) {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')

  const tf = (label, color, value, setValue) => (
    <TextField
      variant='outlined'
      label={label}
      color={color}
      style={{ margin: 5 }}
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  )
  
  const userData = {
    email: email,
    username: username,
    password1: password1,
    password2: password2,
  }
  console.log(userData)

  return (
    <div>
      <h1>Register</h1>
      <Box style={{ textColor: 'white' }}>
        {tf('email', 'success', email, setEmail)}
        {tf('username', 'secondary', username, setUsername)}
      </Box>
      <Box style={{ textColor: 'white' }}>
        {tf('password1', 'warning', password1, setPassword1)}
        {tf('password2', 'warning', password2, setPassword2)}
      </Box>
    </div>
  )
}
