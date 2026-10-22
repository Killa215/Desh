import { useState } from 'react';
import '../styles/asideBar.css'


export default function AsideBar({active, setActive}){
  return (
    <aside className="aside">
      <section className="logo"></section>
      <nav className="nav">
        <ul className="listFunction">
          <button
            className={active === 'Main' ? 'active' : 'uiLink'}
            onClick={()=>setActive('Main')}>
            Main
          </button>
          <button 
            className={active === 'Tasck' ? 'active' : 'uiLink'}
            onClick={()=>setActive('Tasck')}>
            Tasks
          </button>
          <button 
            className={active === 'СalorieСounter' ? 'active' : 'uiLink'}
            onClick={()=>setActive('СalorieСounter')}>
            Сalorie Сounter
          </button>
          <button 
            className={active === 'd' ? 'active' : 'uiLink'}
            onClick={()=>setActive('d')}>
            d
          </button>
        </ul>
      </nav>
    </aside>
  );
}