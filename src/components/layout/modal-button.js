import { Button, Modal } from 'react-bootstrap'
import React, { useState } from 'react'

const ModalButton = ({ children, button, buttonClass = 'btn-link' }) => {
  const [show, setShow] = useState(false)

  return (
    <div>
      <Button style={{ padding: '0px' }} variant='link' onClick={() => setShow(true)} className={buttonClass}>
        {button}
      </Button>
      <Modal show={show} onHide={() => setShow(false)} size='lg'>
        <Modal.Body>
          {children}
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default ModalButton
