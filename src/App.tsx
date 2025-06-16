import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SwipeDeck from './components/SwipeDeck'
import Garage from './components/Garage'

function Submit() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <h1 className="text-4xl font-bold">Submit page</h1>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SwipeDeck />} />
        <Route path="/garage" element={<Garage />} />
        <Route path="/submit" element={<Submit />} />
      </Routes>
    </Router>
  )
}

export default App 