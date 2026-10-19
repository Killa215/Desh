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
            className={active === 'a' ? 'active' : 'uiLink'}
            onClick={()=>setActive('a')}>
            Tasks
          </button>
          <button 
            className={active === 's' ? 'active' : 'uiLink'}
            onClick={()=>setActive('s')}>
            s
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