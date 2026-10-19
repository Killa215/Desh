import { useState } from 'react'
import AsideBar from './UI/AsideBar'
import Screen from './UI/Screen'
import './App.css'


function App() {
  const [active, setActive] = useState('Main');
  return (
    <>
      <main className='app-container'>
      <AsideBar active={active} setActive={setActive}/>
      <Screen active={active}/>
      </main>
    </>
  )
}

export default App
