import * as React from 'react'
import { useNavigate } from "react-router-dom"

import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import MenuIcon from '@mui/icons-material/Menu'
import HomeIcon from '@mui/icons-material/Home'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import CalculateIcon from '@mui/icons-material/Calculate';
import TaskIcon from '@mui/icons-material/Task'
import BrowserNotSupportedIcon from '@mui/icons-material/BrowserNotSupported';

// 'right', 'top', 'bottom'
const drawers = {
  'left': < MenuIcon />
}

const links1 = {
  'Home': {
    'icon': <HomeIcon />,
    'path': '/',
  },
  'Services': {
    'icon': <SupportAgentIcon />,
    'path': '/services'
  },
  'Calculator': {
    'icon': <CalculateIcon />,
    'path': '/calculator'
  },
}
const links2 = {
  'To Do': {
    'icon': <TaskIcon />,
    'path': '/todo'
  },
  ' 404': {
    'icon': <BrowserNotSupportedIcon />,
    'path': '/404'
  },
}

export default function DrawerFS() {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  })
  const navigate = useNavigate()


  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }
    setState({ ...state, [anchor]: open })
  }

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {Object.keys(links1).map((text) => (
          <ListItem
            key={text}
            disablePadding
            onClick={() => { navigate(links1[text]['path']) }}
          >
            <ListItemButton>
              <ListItemIcon>
                {links1[text]['icon']}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {Object.keys(links2).map((text) => (
          <ListItem
            key={text}
            disablePadding
            onClick={() => { navigate(links2[text]['path']) }}
          >
            <ListItemButton>
              <ListItemIcon>
                {links2[text]['icon']}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <div style={{
      textAlign: 'left',
    }}>
      {Object.keys(drawers).map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>
            {drawers[anchor]}
          </Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  )
}
