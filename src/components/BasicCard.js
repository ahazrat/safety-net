import * as React from 'react'
import { Link } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

export default function BasicCard(props) {
  return (
    <Card sx={{ width: 300, margin: 1, textAlign: 'left' }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
          {props.text1}
        </Typography>
        <Typography variant='h5' component='div'>
          {props.text2}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color='text.secondary'>
          {props.text3}
        </Typography>
        <Typography variant='body2'>
          {props.text4}
        </Typography>
      </CardContent>
      {props.url ? 
        <CardActions>
          <Link to='/calculator' underline='hover' style={{underline: 'hover'}}>
            <Button size='small'>Learn More</Button>
          </Link>
        </CardActions>
      : null}
    </Card>
  )
}
