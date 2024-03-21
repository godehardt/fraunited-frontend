import { Button, Card, Col, Container, Form, Row, ToggleButton } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { fetchHistogramData, getAllProtocols } from '../../utils/api'
import Ties from '../charts/ties'
import Pie from '../charts/pie'
import Radar from '../charts/radar'
import Boxplot from '../charts/boxplot'
import Comparison from '../charts/comparison'
import Dropdown from '../form/dropdown'
import Stack from 'react-bootstrap/Stack'
import HistogramContainer from './histogram-container'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const ProtocolResults = () => {
  // data
  const [selectedProtocol, setSelectedProtocol] = useState(undefined)
  const [selectedProtocolId, setSelectedProtocolId] = useState(undefined)
  const [allProtocolIds, setAllProtocolIds] = useState([])
  const [selectedMatchUpIds, setSelectedMatchUpIds] = useState([])
  const [matchBatch, setMatchBatch] = useState(undefined)
  const [selectedCommitId, setSelectedCommitId] = useState(undefined)
  const [allCommitIds, setAllCommitIds] = useState([])
  const [matchCount, setMatchCount] = useState(0)

  // Histogram stuff
  const [property, setProperty] = useState('goals')
  const [binSize, setBinSize] = useState('60')

  // Routes on demand
  const { status: allProtocolStatus, data: allProtocolData, error: allProtocolError } = useQuery('getAllProtocols', () => getAllProtocols())
  // const { status: matchBatchStatus, data: matchBatchData, refetch: matchBatchRefetch } = useQuery('fetchMatchBatch', () => fetchMatchBatch(selectedProtocolId, selectedMatchUpIds, selectedCommitId), { enabled: false, retry: false })
  const { status: histogramStatus, data: histogramData, error: histogramError, refetch: histogramRefetch } = useQuery('fetchHistogramData', () => fetchHistogramData(selectedProtocolId, selectedMatchUpIds, selectedCommitId, property, binSize), { enabled: false, retry: false })

  useEffect(() => {
    if (property && binSize) {
      grabMatchBatchForSelection()
    }
  }, [property, binSize])

  useEffect(() => {
    if (allProtocolData) {
      const ids = allProtocolData.map(prot => prot._id)
      setAllProtocolIds(ids)
      setSelectedProtocolId(ids[0])
    }
  }, [allProtocolData])

  useEffect(() => {
    grabMatchBatchForSelection()
  }, [selectedMatchUpIds])

  useEffect(() => {
    if (selectedProtocolId) {
      console.log('selected protocol id', selectedProtocolId)
      const protocol = allProtocolData.find(prot => prot._id === selectedProtocolId)
      if (!protocol) {
        return
      }
      setSelectedProtocol(protocol)
      if (protocol.statistics) {
        setAllCommitIds(Object.keys(protocol.statistics.commits))
        setMatchCount(protocol.statistics.nmatches)
      }
    }
  }, [selectedProtocolId])

  useEffect(() => {
    grabMatchBatchForSelection()
  }, [selectedCommitId])

  useEffect(() => {
    grabMatchBatchForSelection()
  }, [selectedProtocol])

  /*
  useEffect(() => {
    if (matchBatch) {
      setMatchCount(matchBatch.nmatches)
    } else {
      setMatchCount(0)
    }
  }, [matchBatch])

  useEffect(() => {
    if (matchBatchData) {
      if (!matchBatchData.status) {
        setMatchBatch(matchBatchData)
      } else {
        setMatchBatch(undefined)
      }
    }
  }, [matchBatchData])
  */

  function grabMatchBatchForSelection () {
    if (selectedProtocolId && !!selectedProtocol.statistics) {
      if (selectedCommitId) {
        setMatchCount(selectedProtocol.statistics.commits[selectedCommitId])
      } else {
        setMatchCount(selectedProtocol.statistics.nmatches)
      }
      setMatchBatch(selectedProtocol.statistics)
      // matchBatchRefetch()
      histogramRefetch()
    }
  }

  function onToggleSelectedMatchUpClick (matchUp) {
    if (selectedMatchUpIds.find(id => id === matchUp.id) === undefined) {
      setSelectedMatchUpIds(prevIds => {
        return [
          ...prevIds,
          matchUp.id
        ]
      })
    } else {
      const newIds = selectedMatchUpIds.filter(id => id !== matchUp.id)
      setSelectedMatchUpIds(newIds)
    }
  }

  function onProtocolBatchRefetchClick () {
    setSelectedMatchUpIds([])
  }

  function onMatchCountChange (event) {
    setMatchCount(event.target.value)
  }

  function getCheckedStatus (matchupId) {
    return selectedMatchUpIds.find(id => id === matchupId) !== undefined
  }

  let protocolSelector = (<></>)

  if (allProtocolStatus === 'loading') {
    protocolSelector = <div>Loading...</div>
  }

  if (allProtocolStatus === 'error') {
    protocolSelector = <div>Error: {allProtocolError.message}</div>
  }

  if (allProtocolStatus === 'success' && !!allProtocolIds && !!allProtocolData) {
    protocolSelector = (
      <>
        <Card className='h-100'>
          <Card.Body>
            <Row>
              <Col>
                <Form.Group className='mb-3'>
                  <Form.Label>
                    <h4>
                      Protocol
                    </h4>
                  </Form.Label>
                  <Dropdown options={allProtocolIds} displayedOptionSuffixes={allProtocolData.map(prot => prot.name)} placeholder='Select protocol' state={selectedProtocolId} setState={setSelectedProtocolId} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className='mb-3'>
                  <Form.Label>
                    <h4>
                      Commit
                    </h4>
                  </Form.Label>
                  <Dropdown options={allCommitIds} placeholder='Select commit' state={selectedCommitId} setState={setSelectedCommitId} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className='mb-3'>
                  <Form.Label>
                    <h4>
                      Matches
                    </h4>
                  </Form.Label>
                  <Form.Control readOnly type='text' value={matchCount} onChange={onMatchCountChange} />
                  <Form.Text className='text-muted'>
                    Total number of games played for the given selection. If all matchups and no commit id is selected, this number is the total games played under the protocol
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </>
    )
  }

  let protocolInfoContent = (<></>)

  if (selectedProtocol !== undefined && selectedProtocol !== null) {
    protocolInfoContent = (
      <>
        <Card className='h-100'>
          <Card.Body>
            <Row>
              <Col>
                <h4>
                  Matchups
                </h4>
              </Col>
            </Row>

            <Stack gap={2}>

              <Row className='g-3'>
                <Col>
                  <Button variant={selectedMatchUpIds.length === 0 ? 'dark' : 'outline-dark'} style={{ width: '100%' }} onClick={() => onProtocolBatchRefetchClick()}>All</Button>
                </Col>
              </Row>

              <Row className='g-3'>
                {
                  selectedProtocol.matchups.map((value, index) => {
                    return (
                      <Col key={index}>
                        <ToggleButton variant={getCheckedStatus(value.id) ? 'dark' : 'outline-dark'} checked={getCheckedStatus(value._id)} value={value._id} onClick={() => onToggleSelectedMatchUpClick(value)}>{value.team_l.name} - {value.team_r.name}</ToggleButton>
                      </Col>
                    )
                  })
                }
              </Row>
            </Stack>
          </Card.Body>
        </Card>
      </>
    )
  }

  let protocolResultContent = (<></>)

  /*
  if (matchBatchStatus === 'loading') {
    protocolResultContent = <div>Loading...</div>
  }

  if (matchBatchStatus === 'error') {
    protocolResultContent = <div>Error: {matchBatchStatus.message}</div>
  }
  */

  protocolResultContent = (
    <>
      <Stack gap={3}>
        <Row className='g-3'>
          <Col md={12} lg={6}><Ties data={matchBatch} /></Col>
          <Col md={12} lg={6}><Boxplot data={matchBatch} /></Col>
          <Col md={12} lg={6}><Pie data={matchBatch} /></Col>
          <Col md={12} lg={6}><Radar data={matchBatch} /></Col>
          <Col xs={12}><Comparison data={matchBatch} /></Col>
        </Row>
        <Row className='g-3'>
          <Col md={12}>
            <HistogramContainer dataStatus={histogramStatus} dataError={histogramError} data={histogramData} matchBatch={matchBatch} property={property} setProperty={setProperty} binSize={binSize} setBinSize={setBinSize} />
          </Col>
        </Row>
      </Stack>
    </>
  )

  return (
    <>
      <Container className='my-3'>
        {protocolSelector}
      </Container>
      <Container className='my-3'>
        {protocolInfoContent}
      </Container>
      <Container className='my-3'>
        {protocolResultContent}
      </Container>
    </>
  )
}

export default ProtocolResults
