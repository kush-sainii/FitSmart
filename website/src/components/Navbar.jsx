import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu} aria-label="FitSmart Home">
          <span className="logo-icon">💪</span>
          <span className="logo-text">FitSmart</span>
        </Link>
        
        <button 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/" className="nav-link" onClick={closeMenu}>
              <span className="nav-icon">🏠</span> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/workouts" className="nav-link" onClick={closeMenu}>
              <span className="nav-icon">🏋️</span> Workouts
            </Link>
          </li>
          <li>
            <Link to="/progress" className="nav-link" onClick={closeMenu}>
              <span className="nav-icon">📊</span> Progress
            </Link>
          </li>
          <li>
            <Link to="/food" className="nav-link" onClick={closeMenu}>
              <span className="nav-icon">🍎</span> Food
            </Link>
          </li>
          <li>
            <Link to="/reminders" className="nav-link" onClick={closeMenu}>
              <span className="nav-icon">🔔</span> Reminders
            </Link>
          </li>
          <li>
            <Link to="/profile" className="nav-link" onClick={closeMenu}>
              <span className="nav-icon">👤</span> Profile
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
