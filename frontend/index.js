import './styles/reset.css'
import './styles/styles.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import Books from './components/Books'

const domNode = document.getElementById('root')
const root = createRoot(domNode)

root.render(
  <Books />
)
