//import { useState } from 'react'
import './css/App.css'
import { Routes, Route } from 'react-router-dom'


function App() {


  return (
    <>
    <FavoritosProvider>
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </FavoritosProvider>
    </>
  )
}

export default App
