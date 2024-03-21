import { Col, Row } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import { TeamInfo } from '../../data/TeamInfo'
import Dropdown from './dropdown'

const MatchUpEntry = ({ latestMode, teamNames, matchUp, onChange }) => {
  const [selectedTeamL, setSelectedTeamL] = useState(matchUp.team_l ? matchUp.team_l.name : '')
  const [selectedTeamR, setSelectedTeamR] = useState(matchUp.team_r ? matchUp.team_r.name : '')

  function onSetSelectedTeamL (event) {
    if (matchUp !== undefined) {
      matchUp.team_l = new TeamInfo(event)
      setSelectedTeamL(event)
      onChange()
    }
  }

  function onSetSelectedTeamR (event) {
    if (matchUp !== undefined) {
      matchUp.team_r = new TeamInfo(event)
      setSelectedTeamR(event)
      onChange()
    }
  }

  useEffect(() => {
    if (matchUp === undefined) {
      setSelectedTeamL('')
      setSelectedTeamR('')
    }
  }, [matchUp])

  const teamL = matchUp
    ? latestMode
        ? (
          <>
            <Dropdown placeholder={undefined} options={[matchUp.team_l.name]} disabled state={matchUp.team_l.name} setState={() => null} />
          </>
          )
        : (
          <>
            <Dropdown options={teamNames} placeholder='Team Left' state={selectedTeamL} setState={onSetSelectedTeamL} />
          </>
          )
    : ''

  const teamR = matchUp
    ? (
      <>
        <Dropdown options={teamNames} placeholder='Team Right' state={selectedTeamR} setState={onSetSelectedTeamR} />
      </>
      )
    : ''

  return (
    <>
      <Row className='mb-3'>
        <Col sm={5}>
          {teamL}
        </Col>
        <Col sm={5}>
          {teamR}
        </Col>

      </Row>
    </>
  )
}

export default MatchUpEntry
