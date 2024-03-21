import { Alert, Button, ButtonGroup, Card, Col, Container, Form, Row, Spinner, Stack } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import MatchUpCreator from './matchup-creator'
import { useQuery } from 'react-query'
import { createProtocol, getProtocol, getTeamNames } from '../../utils/api'
import { TrainingProtocolData } from '../../data/TrainingProtocolData'
import Snackbar from '../layout/snackbar'
import TeamConfigCreator from './team-config-creator'
import ProtocolSelector from '../selectors/protocol-selector'

const ProtocolCreator = ({ update }) => {
  const [confirmMessage, setConfirmMessage] = useState('')
  const { status, data, error } = useQuery('getTeamNames', getTeamNames)
  const [name, setName] = useState('')
  const [nGamesPerInstance, setNGamesPerInstance] = useState(50)
  const [nGamesPerInstanceInvalid, setNGamesPerInstanceInvalid] = useState(false)
  const [matchUpsValid, setMatchUpsValid] = useState(false)
  const [matchUps, setMatchUps] = useState([])
  const [configs, setConfigs] = useState([])
  const [protocol, setProtocol] = useState(undefined)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [mode, setMode] = useState('latest')

  const [selectedProtocolId, setSelectedProtocolId] = useState(undefined)
  const [selectedProtocolData, setSelectedProtocolData] = useState(undefined)

  const protocolSelector = (
    <ProtocolSelector setSelectedProtocolData={setSelectedProtocolData} selectedProtocolId={selectedProtocolId} setSelectedProtocolId={setSelectedProtocolId} />
  )

  const { status: protocolStatus, data: protocolData, error: protocolError, refetch: protocolRefetch } = useQuery(['getProtocol', selectedProtocolId], () => getProtocol(selectedProtocolId), {
  })

  useEffect(() => {
    protocolRefetch()
  }, [selectedProtocolId])

  // const { status: createProtocolStatus, data: createProtocolData, error: createProtocolError, refetch: createProtocolRefetch } = useQuery('createProtocol', () => createProtocol(protocol), {
  const { refetch: createProtocolRefetch } = useQuery('createProtocol', () => createProtocol(protocol), {
    enabled: false,
    retry: false
  })

  function enumerateMatchups () {
    let id = 1
    matchUps.forEach(match => {
      match.id = id
      id++
    })
  }

  function onSetProtocolClick () {
    const result = new TrainingProtocolData()
    result.name = name
    result.nMatchesPerInstance = parseInt(nGamesPerInstance)
    result.mode = mode
    result.configs = configs
    enumerateMatchups()
    result.matchups = matchUps

    setProtocol(result)
  }

  function updateName (event) {
    setName(event.target.value)
  }

  function reset () {
    setName('')
    setNGamesPerInstance(50)
    setMatchUps([])
    setConfigs([])
    setProtocol(undefined)
  }

  useEffect(() => {
    reset()
    protocolRefetch()
  }, [update])

  useEffect(() => {
    // The Object.entries thing is to catch an empty response object which only happens if there has not been a protocol yet
    if (protocolData && Object.entries(protocolData).length > 0) {
      setName(protocolData.name)
      setNGamesPerInstance(protocolData.nMatchesPerInstance)
      setMatchUps(protocolData.matchups)
      setConfigs(protocolData.configs)
      setMode(protocolData.mode)
    }
  }, [protocolData])

  useEffect(() => {
    if (protocol !== undefined) {
      createProtocolRefetch().then(res => {
        if (res.status === 'success') { setConfirmMessage(res.data.message) } else { setConfirmMessage('Something went wrong, please try again') }
        setShowConfirmation(true)
        reset()
        protocolRefetch()
      })
    }
  }, [protocol])

  useEffect(() => {
    updateMatchUpsValid()
  }, [matchUps])

  function handleNumberOfGamesChange (event) {
    const value = event.target.value
    if (isNaN(value) || value < 0) {
      setNGamesPerInstanceInvalid(true)
      return
    }

    setNGamesPerInstanceInvalid(false)
    setNGamesPerInstance(value)
  }

  function onSetProtocolMode (modeName) {
    setMode(modeName)
    if (isLatestMode()) {
      // FIXME adjust left team
    }
  }

  function isLatestMode () {
    return mode === 'latest'
  }

  function updateMatchUpsValid () {
    const res = matchUps.length > 0 && matchUps.every(m => m.team_l && m.team_r)
    setMatchUpsValid(res)
  }

  let content
  let errorAlert

  console.log(status)

  if (status === 'loading' || protocolStatus === 'loading') {
    content = <Spinner animation='border' variant='info' />
  }

  if (status === 'error' || protocolStatus === 'error') {
    console.log(error)
    console.log(protocolError)
    errorAlert = <Alert key='warning' variant='warning'>{error ? error.message : ''}{protocolError ? protocolError.statusText : ''}</Alert>
  }

  if (!content || (status === 'success' && protocolStatus === 'success')) {
    content = (
      <Form>
        <Container fluid>
          <Form.Group as={Row} className='mb-3'>
            <Form.Label column sm='2'>
              Mode
            </Form.Label>
            <Col sm='10'>
              <ButtonGroup className='mb-2'>
                <Button variant={mode === 'latest' ? 'primary' : 'light'} onClick={() => onSetProtocolMode('latest')}>Latest</Button>
                <Button variant={mode === 'fixed' ? 'primary' : 'light'} onClick={() => onSetProtocolMode('fixed')}>Fixed</Button>
              </ButtonGroup>
            </Col>
          </Form.Group>
        </Container>
        <Container fluid>
          <Form.Group as={Row} className='mb-3'>
            <Form.Label column sm='2'>
              Name
            </Form.Label>
            <Col>
              <Form.Control type='text' value={name} onChange={updateName} placeholder='Optional name of the protocol' />
              <Form.Control.Feedback type='invalid'>
                Please provide a number greater than or equal to 0
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className='mb-3'>
            <Form.Label column sm='2'>
              Number of matches per instance
            </Form.Label>
            <Col>
              <Form.Control isInvalid={nGamesPerInstanceInvalid} required min='0' type='number' value={nGamesPerInstance} placeholder='Number of games as an integer' onChange={handleNumberOfGamesChange} />
              <Form.Control.Feedback type='invalid'>
                Please provide a number greater than or equal to 0
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
          <MatchUpCreator latestMode={isLatestMode()} teams={data} matchUps={matchUps} setMatchUps={setMatchUps} update={() => { updateMatchUpsValid() }} />
          <TeamConfigCreator configs={configs} setConfigs={setConfigs} />
          <Button variant='primary' disabled={nGamesPerInstanceInvalid || matchUpsValid === false} onClick={() => onSetProtocolClick()}>Use protocol</Button>
        </Container>
      </Form>
    )
  }

  return (
    <Container className='my-3'>
      <Card className='h-100'>
        <Card.Body>
          <Stack gap={3}>
            <Row>
              <Col>
                <h4>
                  Protocol Creator
                </h4>
              </Col>
            </Row>

            <Card className='h-100'>
              <Card.Header className='d-flex justify-content-between align-items-center'>
                Protocol Selector
              </Card.Header>
              <Card.Body>
                <div>
                  {protocolSelector}
                </div>
              </Card.Body>
            </Card>

            {errorAlert}

            <Card className='h-100'>
              <Card.Header className='d-flex justify-content-between align-items-center'>
                Protocol Settings
              </Card.Header>
              <Card.Body>
                <div>
                  {content}
                </div>
                <Snackbar setShow={setShowConfirmation} show={showConfirmation} status='primary' message={confirmMessage} />
              </Card.Body>
            </Card>
          </Stack>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default ProtocolCreator
