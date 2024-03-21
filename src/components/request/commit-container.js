import { useQuery } from 'react-query'
import { fetchCommitData } from '../../utils/api'

import Boxplot from '../charts/boxplot'
import Comparison from '../charts/comparison'
import Pie from '../charts/pie'
import Radar from '../charts/radar'
import Ties from '../charts/ties'
import MetaContainer from '../request/meta-container'
import HistogramContainer from '../request/histogram-container'

import { Row, Col, Container } from 'react-bootstrap'
import React from 'react'

const CommitContainer = ({ commitId }) => {
  const { status, data, error } = useQuery(
    ['commit-data', commitId],
    () => fetchCommitData(commitId)
  )

  const matchBatch = data ? data.matchStatistics : undefined

  let content

  if (status === 'loading') {
    content = <div>Loading...</div>
  }

  if (status === 'error') {
    content = <div>Error: {error.message}</div>
  }

  if (status === 'success') {
    content = (
      <>
        <Row className='g-3'>
          <Col md={12} lg={6}><Ties data={matchBatch} /></Col>
          <Col md={12} lg={6}><Boxplot data={matchBatch} /></Col>
          <Col md={12} lg={6}><Pie data={matchBatch} /></Col>
          <Col md={12} lg={6}><Radar data={matchBatch} /></Col>
          <Col xs={12}><Comparison data={matchBatch} /></Col>
        </Row>
      </>
    )
  }

  return (
    <>
      <Container className='my-3'>
        <MetaContainer commitId={commitId} commitData={data} />
      </Container>
      <Container className='my-3'>
        {content}
      </Container>
      <Container className='my-3'>
        <HistogramContainer commitId={commitId} commitData={data} />
      </Container>
    </>
  )
}

export default CommitContainer
