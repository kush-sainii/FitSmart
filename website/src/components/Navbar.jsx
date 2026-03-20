import React from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" aria-label="FitSmart Home">
          <span className="logo-icon">💪</span>
          <span className="logo-text">FitSmart</span>
        </Link>
        <ul className="nav-menu">
          <li>
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li>
            <Link to="/exercises" className="nav-link">Exercise Plans</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
