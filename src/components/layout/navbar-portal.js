import React from 'react'
import ReactDOM from 'react-dom'

const NavbarPortal = ({ children }) => {
  return ReactDOM.createPortal(
    (
      <div className='me-2'>
        {children}
      </div>
    ), document.getElementById('navbar-portal'))
}

export default NavbarPortal
