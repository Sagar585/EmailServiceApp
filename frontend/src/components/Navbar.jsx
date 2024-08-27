import React, { useState } from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom'; // Make sure you're using react-router-dom for navigation
import logo from '../assets/logo.png';

const Navbar = () => {
  const [activePage, setActivePage] = useState('Home');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSetActivePage = (page) => {
    setActivePage(page);
    setMenuOpen(false); // Close the menu when a link is clicked
  };

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const token = localStorage.getItem('token');


  return (
    <header className="header">
      <nav className="nav">
        <div className="logo">
          <a href="/"><img src={logo} alt="Email Logo" className="logo-image" /></a>
        </div>
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li>
            <a href="/getEmail" id='getEmail' className={activePage === 'getEmail' ? 'active' : ''} onClick={() => handleSetActivePage('getEmail')}>Emails</a>
          </li>
          <li>
            <a href="/addEmail" id='addEmail' className={activePage === 'addEmail' ? 'active' : ''} onClick={() => handleSetActivePage('addEmail')}>DraftEmail</a>
          </li>
          <li>
            <a href="/report" id='report' className={activePage === 'report' ? 'active' : ''} onClick={() => handleSetActivePage('report')}>  Report</a>
          </li>
          {!token &&
         <li>
             <a href="/login" style={{ paddingBottom: "10px" , color:'white' }} id='Login' className="Logout" >login</a>
             </li>}
          {!token &&
          <li>
          <a href="/onBoard" id="onBoard" style={{ paddingBottom: "10px" , color:'white' }} className="Logout">Onboard</a>
          </li>
        }
           {token &&
          <li>
              <button id='Logout' className="Logout" onClick={handleLogout}>Logout</button>
              </li>}
        </ul>
        <div className="menu-toggle" onClick={handleMenuToggle}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
