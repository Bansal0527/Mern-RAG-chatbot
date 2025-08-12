import { useState } from 'react'
import React from 'react'
import './App.css';

function App() {
  const [count, setCount] = useState(0)

  return (
  <div className='text-center bg-gray-100 h-screen flex items-center justify-center'>
    Hello
  </div>
  )
}

export default App
