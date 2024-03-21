import React from 'react'
import { Container } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import ProtocolContainer from '../request/protocol-container'
// import MatchView from './match-view'

const ProtocolView = () => {
  const { protocolId } = useParams()

  return (
    <Container className='p-4'>
      <ProtocolContainer protocolId={protocolId} />
    </Container>
  )
}

export default ProtocolView
