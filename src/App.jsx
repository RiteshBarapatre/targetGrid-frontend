import { useState } from 'react'
import './App.css'
import Header from './Components/Header'
import Main from './Components/Main'
import Grid from './Components/Grid'

function App() {
  
  // Storing email for showing grid accordingly
  const [email,setEmail] = useState("")

  return (
    <div className="app">
      <Header/>
      <Main setEmail={setEmail} />
      <Grid email={email} setEmail={setEmail}/>
    </div>
  )
}

export default App
