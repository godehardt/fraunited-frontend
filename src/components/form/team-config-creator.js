import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { Config } from '../../data/config'
import ConfigEntry from './config-entry'
import { MdDelete } from 'react-icons/md'

const TeamConfigCreator = ({ configs, setConfigs }) => {
  const [configIdCounter, setConfigIdCounter] = useState(1)

  function onAddConfigClick () {
    const entry = new Config(configIdCounter)

    setConfigIdCounter(current => current + 1)
    setConfigs(oldArray => [...oldArray, entry])
  }

  function onDeleteConfigClick (config) {
    const result = configs.filter((item) => item.id !== config.id)
    setConfigs(result)
  }

  useEffect(() => {
    if (configs.length > 0) {
      const maxId = Math.max(...configs.map(m => m.id))
      setConfigIdCounter(maxId + 1)
    }
  })

  return (
    <>
      <Form.Group as={Row} className='mb-3'>
        <Form.Label column sm='2'>
          Configs
        </Form.Label>
        <Col sm='10'>
          <Button variant='primary' onClick={() => onAddConfigClick()}>Add Config</Button>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className='mb-3'>
        <Form.Label column sm='2' />
        <Col>
          {
                        configs.map((value, index) => {
                          return (
                            <Row key={index}>
                              <Col sm={11}>
                                <div style={{ marginBottom: '10px' }}>
                                  <Card className='h-100'>
                                    <Card.Header className='d-flex justify-content-between align-items-center'>
                                      <Form.Control
                                        type='text' name='fileName' value={value.fileName} onChange={event => {
                                          const fileName = event.target.value
                                          setConfigs(currentConfigs => currentConfigs.map(conf => conf.id === value.id ? { ...conf, fileName } : conf))
                                        }} placeholder='Config filename (example: agent.conf)'
                                      />
                                    </Card.Header>
                                    <Card.Body>
                                      <ConfigEntry config={value} />
                                    </Card.Body>
                                  </Card>
                                </div>
                              </Col>
                              <Col sm={1}>
                                <Button variant='dark' onClick={() => onDeleteConfigClick(value)}><MdDelete /></Button>
                              </Col>
                            </Row>
                          )
                        })
                    }
        </Col>
      </Form.Group>
    </>
  )
}

export default TeamConfigCreator
