import TeamUpload from '../form/team-upload'
import React, { useEffect, useState } from 'react'
import ProtocolCreator from '../form/protocol-creator'
import { Stack, Tab, Tabs } from 'react-bootstrap'
import ProtocolResults from './protocol-results'
import TeamInspector from '../form/team-inspector'
import LogfileInspector from '../form/logfile-inspector'

const ProtocolContainer = () => {
  const [change, setChange] = useState()

  function update (timestamp) {
    setChange(timestamp)
  }

  useEffect(() => {
  }, [change])

  return (
    <div>
      <Tabs transition={false} defaultActiveKey='status' className='mb-3'>
        <Tab eventKey='status' title='Protocol Results'>
          <ProtocolResults />
        </Tab>
        <Tab eventKey='protocolCreator' title='Protocol Creator'>
          <ProtocolCreator update={change} />
        </Tab>
        <Tab eventKey='teamUpload' title='Team Upload'>
          <Stack gap={3}>
            <div>
              <TeamUpload update={update} />
            </div>
            <div>
              <TeamInspector update={update} />
            </div>
          </Stack>
        </Tab>
        <Tab eventKey='logfileInspector' title='Interesting Matches'>
          <LogfileInspector />
        </Tab>
      </Tabs>
    </div>
  )
}

export default ProtocolContainer
