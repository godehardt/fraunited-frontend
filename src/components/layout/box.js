import React from 'react'
import { Card } from 'react-bootstrap'
import Dropdown from '../form/dropdown'

const Box = ({ children, header, options, state, setState, dropdowns }) => {
  let dropdown = (<div className='invisible'><Dropdown /></div>)
  if (options || dropdowns) {
    dropdown = (
      <div className='d-flex gap-2'>
        {
          dropdowns
            ? dropdowns.map(
                (element, index) =>
                  <Dropdown key={index} options={element.options} state={element.state} setState={element.setState} />
              )
            : <Dropdown options={options} state={state} setState={setState} />
        }
      </div>
    )
  }

  return (
    <Card className='h-100'>
      <Card.Header className='d-flex justify-content-between align-items-center'>
        {header}
        {dropdown}
      </Card.Header>
      <Card.Body>
        {children}
      </Card.Body>
    </Card>
  )
}

export default Box
