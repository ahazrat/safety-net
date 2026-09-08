import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { doCreateUserWithEmailAndPassword, createUser, Roles } from '@safety-net/shared'

export default function Register(props) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState(null)

  const tf = (label, color, value, setValue, type = 'text') => (
    <TextField
      variant='outlined'
      label={label}
      color={color}
      type={type}
      style={{ margin: 5 }}
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  )

  const isInvalid =
    email === '' || username === '' || password1 === '' || password1 !== password2

  const onSubmit = e => {
    e.preventDefault()
    doCreateUserWithEmailAndPassword(email, password1)
      .then(cred => {
        return createUser({
          uid: cred.user.uid,
          username,
          email,
          roles: { [Roles.USER]: Roles.USER },
        })
      })
      .then(() => navigate('/'))
      .catch(setError)
  }

  return (
    <div>
      <h1>Register</h1>
      <Box component='form' onSubmit={onSubmit}>
        <Box style={{ textColor: 'white' }}>
          {tf('email', 'success', email, setEmail)}
          {tf('username', 'secondary', username, setUsername)}
        </Box>
        <Box style={{ textColor: 'white' }}>
          {tf('password1', 'warning', password1, setPassword1, 'password')}
          {tf('password2', 'warning', password2, setPassword2, 'password')}
        </Box>
        <Box style={{ marginTop: 10 }}>
          <Button variant='contained' type='submit' disabled={isInvalid}>Register</Button>
        </Box>
        {error && <p style={{ color: 'red' }}>{error.message}</p>}
      </Box>
    </div>
  )
}
