import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Layout from './components/Layout'

import Register from './pages/admin/Register'
// import Login from './pages/admin/Login'
// import Profile from './pages/admin/Profile'

import Home from './pages/Home'
import Services from './pages/Services'
import Map from './pages/Map'
import Listings from './pages/Listings'
import ToDo from './pages/ToDo'
import NoPage from './pages/NoPage'

import './App.css'

export default function App() {

  return (
    <div className='App' style={{
      minHeight: '100vh',
      backgroundColor: '#282c34',
      color: 'white',
      textAlign: 'center',
    }}>
      {/* <BrowserRouter> */}
      <BrowserRouter basename='/safety-net'>
        <Routes>
          <Route path='/' element={<Layout />}>

            <Route index element={<Home />} />
            <Route path='register' element={<Register />} />

            <Route path='services' element={<Services />} />
            <Route path='map' element={<Map />} />
            <Route path='listings' element={<Listings />} />
            <Route path='todo' element={<ToDo />} />

            <Route path='*' element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
