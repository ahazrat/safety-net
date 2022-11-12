import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Layout from './components/Layout'

import Home from './pages/Home'
import Services from './pages/Services'
import Calculator from './pages/Calculator'
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
            <Route path='services' element={<Services />} />
            <Route path='calculator' element={<Calculator />} />
            <Route path='todo' element={<ToDo />} />
            <Route path='*' element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
