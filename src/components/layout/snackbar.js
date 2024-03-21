import React from 'react'
import { Toast } from 'react-bootstrap'

const Snackbar = ({ show, setShow, status, message }) => {
  function getSnackBarCss () {
    return `snackBar bg-${status}`
  }

  return (
    <Toast className={getSnackBarCss()} onClose={() => setShow(false)} show={show} delay={5000} autohide animation={false}>
      <Toast.Body>{message}</Toast.Body>
    </Toast>
  )
}

export default Snackbar
