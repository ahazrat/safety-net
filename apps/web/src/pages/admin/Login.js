import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { doSignInWithEmailAndPassword } from '@safety-net/shared'

export default function Login(props) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const isInvalid = email === '' || password === ''

  const onSubmit = e => {
    e.preventDefault()
    doSignInWithEmailAndPassword(email, password)
      .then(() => navigate('/'))
      .catch(setError)
  }

  return (
    <div>
      <h1>Login</h1>
      <Box component='form' onSubmit={onSubmit} style={{ textColor: 'white' }}>
        <TextField
          variant='outlined'
          label='email'
          style={{ margin: 5 }}
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <TextField
          variant='outlined'
          label='password'
          type='password'
          style={{ margin: 5 }}
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Box style={{ marginTop: 10 }}>
          <Button variant='contained' type='submit' disabled={isInvalid}>Login</Button>
        </Box>
        {error && <p style={{ color: 'red' }}>{error.message}</p>}
      </Box>
    </div>
  )
}
