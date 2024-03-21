import { Card, Col, Container, Row, Stack } from 'react-bootstrap'
import TeamUpload from '../form/team-upload'
import TeamInspector from '../form/team-inspector'
import React, { useState } from 'react'

const TeamsView = () => {
  const [setChange] = useState()

  function update (timestamp) {
    setChange(timestamp)
  }
  return (
    <>
      <Container className='my-3'>
        <Card className='h-100'>
          <Card.Body>
            <Stack gap={3}>
              <Row>
                <Col>
                  <h4>
                    Teams
                  </h4>
                </Col>
              </Row>
              <Stack gap={3}>
                <div>
                  <TeamUpload update={update} />
                </div>
                <div>
                  <TeamInspector update={update} />
                </div>
              </Stack>
            </Stack>
          </Card.Body>
        </Card>
      </Container>
    </>
  )
}

export default TeamsView
