
import React from 'react'
import { Container, Card, Stack } from 'react-bootstrap'

const AboutPage = () => {
  return (
    <>
      <Container className='my-3'>
        <Card className='h-100'>
          <Card.Title>
            <p style={{ marginLeft: '10px', marginTop: '10px' }}><b>About</b></p>
          </Card.Title>
          <Card.Body>
            <Stack gap={3}>
              <Card.Title>Description</Card.Title>
              <Stack gap={3}>
                <p>
                  Website to analyze the Virtual soccer team of the Frankfurt University of Applied Sciences.
                  Oberserve the different statistics of played matches and their training results.
                  Compare the history of matches to evaluate the progress of the RoboCup team.
                  Configuring and start new training sessions.
                </p>
              </Stack>
            </Stack>
          </Card.Body>
          <Card.Body>
            <Stack gap={3}>
              <Card.Title>Contribution</Card.Title>
              <Stack gap={3}>
                Vincent Roßknecht,
                Alexander Atasonov, Marco Tenderra, Frederik Kliemt,
                Sagarkumar Laljibhai Barvaliya,
                Jonas Hülsmann,
                Lucas Merkert,
                Florian Pauly,
                Cyriax Brast,
                Malte Koch,
                Francisco Seipel-Soubrier,
                Yalcin Eren
              </Stack>
            </Stack>
          </Card.Body>
        </Card>
      </Container>
    </>
  )
}
export default AboutPage
