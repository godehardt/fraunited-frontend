import React from 'react'
import { Form } from 'react-bootstrap'

const Dropdown = ({ options, placeholder, state, setState, disabled = false, displayedOptionSuffixes }) => {
  let selectOptions
  let placeholderOption

  if (Array.isArray(options)) {
    selectOptions = options.map((item, index) => (
      <option key={index} value={item}>{displayedOptionSuffixes ? item + ' - ' + displayedOptionSuffixes[index] : item}</option>
    ))
  } else {
    const optionArray = []
    for (const index in options) {
      optionArray.push(<option key={index} value={index}>{options[index]}</option>)
    }
    selectOptions = optionArray
  }

  if (placeholder) {
    placeholderOption = <option value=''>{placeholder}</option>
  }

  return (
    <div data-state={state}>
      <Form.Control
        as='select'
        className='border form-select'
        value={state}
        disabled={disabled}
        onChange={(event) => setState(event.target.value)}
      >
        {placeholderOption}
        {selectOptions}
      </Form.Control>
    </div>
  )
}

export default Dropdown
