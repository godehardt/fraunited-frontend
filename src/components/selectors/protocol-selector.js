import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { getAllProtocols } from '../../utils/api'
import {
  Form,
  Col,
  Row
} from 'react-bootstrap'
import Dropdown from '../form/dropdown'

const ProtocolSelector = ({ setSelectedProtocolData, selectedProtocolId, setSelectedProtocolId }) => {
  const [allProtocolIds, setAllProtocolIds] = useState([])

  const { status: allProtocolStatus, data: allProtocolData, error: allProtocolError } = useQuery('getAllProtocols', () => getAllProtocols())

  useEffect(() => {
    if (allProtocolData) {
      const ids = allProtocolData.map(prot => prot._id)
      setAllProtocolIds(ids)
      if (!selectedProtocolId) {
        setSelectedProtocolId(ids[0])
      }
    }
  }, [allProtocolData])

  useEffect(() => {
    if (allProtocolData) {
      setSelectedProtocolData(allProtocolData.find(prot => prot._id === selectedProtocolId))
    }
  }, [selectedProtocolId])

  let protocolSelector = (<></>)
  if (allProtocolStatus === 'loading') {
    protocolSelector = <div>Loading...</div>
  } else if (allProtocolStatus === 'error') {
    protocolSelector = <div>Error: {allProtocolError.message}</div>
  } else if (allProtocolStatus === 'idle') {
    protocolSelector = <div>Idle...</div>
  }
  if (allProtocolStatus === 'success') {
    protocolSelector = (
      <>
        <Col>
          <Form.Group as={Row}>
            <Form.Label column xs='auto'>
              <h4 style={{ width: '5em' }}>
                Protocol:
              </h4>
            </Form.Label>
            <Col>
              <Dropdown options={allProtocolIds} displayedOptionSuffixes={allProtocolData.map(prot => prot.name)} placeholder='Select protocol' state={selectedProtocolId} setState={setSelectedProtocolId} />
            </Col>
          </Form.Group>
        </Col>
      </>
    )
  }

  return (
    protocolSelector
  )
}

export default ProtocolSelector
