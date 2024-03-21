import React, { useEffect, useState } from 'react'
import { Form, Row, Col, Button } from 'react-bootstrap'
import { MatchUp } from '../../data/MatchUp'
import { TeamInfo } from '../../data/TeamInfo'
import MatchUpEntry from './matchup-entry'
import { MdDelete } from 'react-icons/md'

const MatchUpCreator = ({ latestMode, teams, matchUps, setMatchUps, update }) => {
  const [matchUpIdCounter, setMatchUpIdCounter] = useState(1)
  const teamNames = teams.map((team) => team.name)

  function onAddMatchUpClick () {
    const matchUp = new MatchUp(matchUpIdCounter)
    if (latestMode) {
      matchUp.team_l = new TeamInfo('FRA-UNIted-LATEST')
    }

    setMatchUpIdCounter(current => current + 1)
    setMatchUps(oldArray => [...oldArray, matchUp])
    update()
  }

  function onDeleteMatchUpClick (matchUp) {
    const result = matchUps.filter((item) => item.id !== matchUp.id)
    setMatchUps(result)
    update()
  }

  useEffect(() => {
    if (matchUps.length > 0) {
      const maxId = Math.max(...matchUps.map(m => m.id))
      setMatchUpIdCounter(maxId + 1)
    }
  })

  return (
    <>
      <Form.Group as={Row} className='mb-3'>
        <Form.Label column sm='2'>
          Match Ups
        </Form.Label>
        <Col sm='10'>
          <Button variant='primary' onClick={() => onAddMatchUpClick()}>Add Match Up</Button>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className='mb-3'>
        <Form.Label column sm='2' />
        <Col>
          {
            matchUps.map(value => {
              return (
                <Row key={value.id}>
                  <Col sm={11}>
                    <div style={{ marginBottom: '10px' }}>
                      <MatchUpEntry latestMode={latestMode} teamNames={teamNames} matchUp={value} onChange={() => update()} />
                    </div>
                  </Col>
                  <Col sm={1}>
                    <Button variant='dark' onClick={() => onDeleteMatchUpClick(value)}><MdDelete /></Button>
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

export default MatchUpCreator
