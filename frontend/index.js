import './styles/reset.css'
import './styles/styles.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import Books from './components/Books'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

const domNode = document.getElementById('root')
const root = createRoot(domNode)

root.render(
  <BrowserRouter>
    <nav>
      <Link to="/">Books</Link> <Link to="about">About</Link>
    </nav>
    <Routes>
      <Route path="/" element={<Books />} />
      <Route path="about" element={<h2>About</h2>} />
    </Routes>
  </BrowserRouter>
)
