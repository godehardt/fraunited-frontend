import { Button, Col, Form, Row } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'

import { ConfigEntryData } from '../../data/config-entry-data'
import { MdDelete } from 'react-icons/md'

const ConfigEntry = ({ config }) => {
  const [configEntryIdCounter, setConfigEntryIdCounter] = useState(1)
  const [configEntries, setConfigEntries] = useState(undefined)

  function onAddConfigEntryClick () {
    const entry = new ConfigEntryData(configEntryIdCounter)
    config.entries = setConfigEntryIdCounter(current => current + 1)
    setConfigEntries(oldArray => [...oldArray, entry])
  }

  function onDeleteConfigEntryClick (entry) {
    const result = configEntries.filter((item) => item.id !== entry.id)
    setConfigEntries(result)
  }

  useEffect(() => {
    if (configEntries) {
      config.entries = configEntries
    }
  }, [configEntries])

  useEffect(() => {
    setConfigEntries(config.entries)
    if (config.entries.length > 0) {
      const maxId = Math.max(...config.entries.map(m => m.id))
      setConfigEntryIdCounter(maxId + 1)
    }
  })

  return (
    <>
      <Form.Group as={Row} className='mb-3'>
        <Form.Label column sm='2'>
          Entries
        </Form.Label>
        <Col sm='10'>
          <Button variant='primary' onClick={() => onAddConfigEntryClick()}>Add Entry</Button>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className='mb-3'>
        <Col>
          {
            configEntries
              ? configEntries.map((e) => {
                  return (
                    <Row key={e.id} style={{ marginBottom: '5px' }}>
                      <Col>
                        <Form.Control
                          name='sectionInput' type='text' value={e.sectionName} onChange={event => {
                            const sectionName = event.target.value
                            setConfigEntries(currentEntries => currentEntries.map(entry => e.id === entry.id ? { ...entry, sectionName } : entry))
                          }} placeholder='Section'
                        />
                      </Col>
                      <Col>
                        <Form.Control
                          name='keyInput' type='text' value={e.key} onChange={event => {
                            const key = event.target.value
                            setConfigEntries(currentEntries => currentEntries.map(entry => e.id === entry.id ? { ...entry, key } : entry))
                          }} placeholder='Key'
                        />
                      </Col>
                      <Col>
                        <Form.Control
                          name='valueInput' type='text' value={e.value} onChange={event => {
                            const value = event.target.value
                            setConfigEntries(currentEntries => currentEntries.map(entry => e.id === entry.id ? { ...entry, value } : entry))
                          }} placeholder='Value'
                        />
                      </Col>
                      <Col sm={1}>
                        <Button variant='dark' onClick={() => onDeleteConfigEntryClick(e)}><MdDelete /></Button>
                      </Col>
                    </Row>
                  )
                })
              : ''
          }
        </Col>
      </Form.Group>
    </>
  )
}

export default ConfigEntry
