import { useQuery } from 'react-query'
import { fetchMatchIndex } from '../../utils/api'
import MatchComparision from '../charts/match-comparision'
import MatchProgress from '../charts/match-progress'
import {
  Container,
  Button,
  ButtonGroup,
  Card,
  Form,
  Col,
  Row,
  Table
} from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import ModalButton from '../layout/modal-button'
import ObjectTree from '../layout/object-tree'
import DownloadButton from '../form/download-button'
import Dropdown from '../form/dropdown'
import React, { useState, useEffect } from 'react'
import ProtocolSelector from '../selectors/protocol-selector'

const MatchContainer = () => {
  const params = useParams()

  const [selectedProtocolId, setSelectedProtocolId] = useState(undefined)
  const [selectedProtocolData, setSelectedProtocolData] = useState(undefined)

  const [allCommitIds, setAllCommitIds] = useState([])
  const [selectedCommitId, setSelectedCommitId] = useState(undefined)

  const [matchCount, setMatchCount] = useState(-1)
  const [matchIndex, setMatchIndex] = useState(0)
  const [match, setMatch] = useState(undefined)
  const [mongoMatchID, setMongoMatchID] = useState(undefined)

  const { status: matchStatus, data: matchData, error: matchError, refetch } = useQuery(['match-index', selectedProtocolId, matchIndex, mongoMatchID], () => fetchMatchIndex(selectedProtocolId, matchIndex, mongoMatchID), { enabled: false })

  function goPrevious () {
    if (matchIndex !== 0) {
      setMatchIndex(matchIndex - 1)
    }
  }
  function goNext () {
    if (matchCount !== matchIndex) {
      setMatchIndex(matchIndex + 1)
    }
  }
  function grabMatchBatchForSelection () {
    if (!selectedProtocolData) {
      return
    }
    if (selectedProtocolData.statistics) {
      if (selectedCommitId) {
        setMatchCount(selectedProtocolData.statistics.commits[selectedCommitId])
      } else {
        setMatchCount(selectedProtocolData.statistics.nmatches)
      }
    }
  }

  useEffect(() => {
    refetch()
  }, [matchIndex])

  useEffect(() => {
    if (!selectedProtocolData) {
      return
    }
    if (selectedProtocolData.statistics) {
      setMatchIndex(0)
      setAllCommitIds(Object.keys(selectedProtocolData.statistics.commits))
      setMatchCount(selectedProtocolData.statistics.nmatches)
      refetch()
    }
  }, [selectedProtocolData])

  useEffect(() => {
    grabMatchBatchForSelection()
  }, [selectedProtocolData, selectedCommitId])

  useEffect(() => {
    if (params.matchId) {
      setMongoMatchID(params.matchId)
    }
  }, [params.matchId])

  useEffect(() => {
    refetch()
  }, [mongoMatchID])

  useEffect(() => {
    if (matchData) {
      setMatch(matchData)
      if (selectedProtocolId) {
        setSelectedProtocolId(matchData.protocolID)
        setSelectedCommitId(matchData.commitID)
      }
    }
  }, [matchData])

  const protocolSelector = (
    <ProtocolSelector setSelectedProtocolData={setSelectedProtocolData} selectedProtocolId={selectedProtocolId} setSelectedProtocolId={setSelectedProtocolId} />
  )

  const selectorComponent = (
    <>
      <Card className='h-100'>
        <Card.Body>
          <Row>
            {protocolSelector}
          </Row>
          <Row>
            <Col>
              <Form.Group as={Row}>
                <Form.Label column xs='auto'>
                  <h4 style={{ width: '5em' }}>
                    Commit:
                  </h4>
                </Form.Label>
                <Col>
                  <Dropdown options={allCommitIds} placeholder='Select commit' state={selectedCommitId} setState={setSelectedCommitId} />
                </Col>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group as={Row}>
                <Form.Label column xs='auto'>
                  <h4 style={{ width: '5em' }}>
                    Match:
                  </h4>
                </Form.Label>
                <Col className='align-self-center' style={{ fontSize: '1.5em', marginBottom: '7px' }}>
                  {matchIndex + 1}/{matchCount}
                </Col>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  )
  // }

  let matchSelector = (<></>)
  if (matchStatus === 'loading') {
    matchSelector = <div>Loading...</div>
  } else if (matchStatus === 'error') {
    matchSelector = <div>Error: {matchError.message}</div>
  } else if (matchStatus === 'idle') {
    matchSelector = <div>Idle...</div>
  }

  let content = (<></>)
  if (match) {
    content = (
      <>
        <Container className='my-3'>
          <MatchComparision data={match} />
        </Container>
        <Container className='my-3'>
          <MatchProgress data={match} />
        </Container>
      </>
    )
  }

  // Put everything together! Whole page with Team-Score and Next-/Previous-Button
  matchSelector = (
    <div>
      <Container className='mb-3'>
        {match
          ? (
            <h2 className='text-center'>
              {match.team_r}
              <div
                className='d-inline p-4 text-primary'
                style={{ fontSize: '200%' }}
              >
                {match.goals_r.length} – {match.goals_l.length}
              </div>
              {match.team_l}
            </h2>
            )
          : (
            <h1 className='text-center'>Loading...</h1>
            )}
      </Container>

      {/* PREVIOUS/ NEXT BUTTON */}
      <div>
        <Container className='d-flex justify-content-end'>
          <ButtonGroup style={{ margin: '5px' }}>
            <Button variant='outline-primary' style={{ width: '6em' }} onClick={() => goPrevious()} disabled={matchIndex === 0 || mongoMatchID}>Previous</Button>
            <Button variant='outline-primary' style={{ width: '6em' }} onClick={() => goNext()} disabled={matchIndex + 1 === matchCount || mongoMatchID}>Next</Button>
          </ButtonGroup>
        </Container>
      </div>

      {/* SELECTOR COMPONENT */}
      <Container>
        {!mongoMatchID ? (selectorComponent) : <div />}
      </Container>

      {/* CONTENT DIAGRAMS */}
      {content}

      {/* MATCH DATA COMPONENT */}
      <Container className='my-3'>
        <Card className='h-100'>
          <Card.Header className='d-flex justify-content-between align-items-center'>
            Match Data
          </Card.Header>
          <Card.Body>
            <Table striped borderless>
              {match !== undefined
                ? (
                  <tbody>
                    <tr>
                      <td>JSON Data</td>
                      <td style={{ padding: '0px', paddingLeft: '5px' }}>
                        <ModalButton
                          buttonClass='btn btn-link'
                          button={
                            <i
                              style={{ fontSize: '24px', padding: '0' }}
                              className='bi bi-filetype-json'
                            />
                            }
                        >
                          <div className='d-flex justify-content-between align-items-center mb-3'>
                            <h5>Match</h5>
                            <DownloadButton
                              name={`Match_${match._id}`}
                              content={match}
                            />
                          </div>
                          <div className='border py-2'>
                            <ObjectTree title='test' object={match} first />
                          </div>
                        </ModalButton>
                      </td>
                    </tr>
                    <tr>
                      <td>Commit ID</td>
                      <td>{match.commitID}</td>
                    </tr>
                    <tr>
                      <td>Protocol ID</td>
                      <td>{match.protocolID}</td>
                    </tr>
                    <tr>
                      <td>Date</td>
                      <td>{match.date}</td>
                    </tr>
                    <tr>
                      <td>Host</td>
                      <td>{match.hostname}</td>
                    </tr>
                  </tbody>
                  )
                : (
                  <div>Loading</div>
                  )}
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
  return matchSelector
}

export default MatchContainer
