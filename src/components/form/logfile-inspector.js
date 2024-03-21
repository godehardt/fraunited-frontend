import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Button, Spinner, Stack, Container } from 'react-bootstrap'
import { useQuery } from 'react-query'
import { downloadLogFiles, getAllProtocols, getLogFileInfos } from '../../utils/api'
import { MdDownload } from 'react-icons/md'
import Dropdown from './dropdown'

const LogfileInspector = () => {
  const [selectedProtocolId, setSelectedProtocolId] = useState(undefined)
  const [allProtocolIds, setAllProtocolIds] = useState([])
  const [selectedProtocolData, setSelectedProtocolData] = useState(undefined)
  const { status: allProtocolStatus, data: allProtocolData, error: allProtocolError } = useQuery('getAllProtocols', () => getAllProtocols())
  const { status, data, error, refetch } = useQuery('getLogFileInfos', () => getLogFileInfos(selectedProtocolId), { enabled: false, retry: false })

  useEffect(() => {
    if (allProtocolData) {
      const ids = allProtocolData.map(prot => prot._id)
      setAllProtocolIds(ids)
      setSelectedProtocolId(ids[0])
    }
  }, [allProtocolData])

  useEffect(() => {
    if (selectedProtocolId) {
      if (allProtocolData) {
        const outliers = (allProtocolData.find(protocol => protocol._id === selectedProtocolId)).outlierDetector.outliers
        setSelectedProtocolData(outliers)
      }
      refetch()
    }
  }, [selectedProtocolId])

  useEffect(() => {

  }, [selectedProtocolData])

  function onDownloadLogFilesClick (info) {
    downloadLogFiles(info.id).then(res => {
      const blob = new Blob([res])
      // Create blob link to download
      const url = window.URL.createObjectURL(
        blob
      )
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
                `${info.logFileName + '_' + info.reason}.zip`
      )

      // Append to html link element page
      document.body.appendChild(link)

      // Start download
      link.click()

      // Clean up and remove the link
      link.parentNode.removeChild(link)
    })
  }

  function boilDownLogFileName (logFileName) {
    const start = logFileName.indexOf('-')
    const end = logFileName.lastIndexOf('-')

    return logFileName.substring(start + 1, end)
  }

  let protocolSelector

  if (allProtocolStatus === 'loading') {
    protocolSelector = <div>Loading...</div>
  }

  if (allProtocolStatus === 'error') {
    protocolSelector = <div>Error: {allProtocolError.message}</div>
  }

  if (allProtocolStatus === 'success' && allProtocolIds !== undefined && allProtocolIds !== null) {
    protocolSelector = (
      <>
        <Dropdown options={allProtocolIds} displayedOptionSuffixes={allProtocolData.map(prot => prot.name)} placeholder='Select protocol' state={selectedProtocolId} setState={setSelectedProtocolId} />
      </>
    )

    let content

    if (status === 'loading') {
      content = <Spinner animation='border' variant='info' />
    }
    if (status === 'error') {
      content = <div>Error: {error.message}</div>
    }

    if (status === 'success') {
      const sortedData = data.sort((a, b) => new Date(b.created).getMilliseconds() - new Date(a.created).getMilliseconds())
      content = (
        <Card className='h-100'>
          <Card.Header className='d-flex justify-content-between align-items-center'>
            Interesting Matches (match logfiles are deleted after 5 days)
          </Card.Header>
          <Card.Body>
            <Row className='mb-3' key={-1}>
              <Col sm='1'>
                Match
              </Col>
              <Col sm='1'>
                Protocol
              </Col>
              <Col sm='4'>
                Commit
              </Col>
              <Col sm='2'>
                Logfilename
              </Col>
              <Col sm='3'>
                Reason
              </Col>
              <Col sm='1'>
                Zip
              </Col>
            </Row>
            {
            sortedData.map((value, index) => {
              return (
                <Row className='mb-3' key={index}>
                  <Col sm='1'>
                    {value.matchId}
                  </Col>
                  <Col sm='1'>
                    {value.protocolId}
                  </Col>
                  <Col sm='4'>
                    {value.commitId}
                  </Col>
                  <Col sm='2'>
                    {boilDownLogFileName(value.logFileName)}
                  </Col>
                  <Col sm='3'>
                    {value.reason}
                  </Col>
                  <Col sm='1'>
                    <Button variant='light' onClick={() => onDownloadLogFilesClick(value)}><MdDownload /></Button>
                  </Col>
                </Row>
              )
            })
          }
          </Card.Body>
        </Card>
      )
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
                      Interesting Matches
                    </h4>
                  </Col>
                </Row>
                <Stack gap={3}>
                  <div>
                    {protocolSelector}

                  </div>
                  <div>
                    {selectedProtocolData
                      ? (
                        <div>
                          <ul>
                            {selectedProtocolData.map((matchId, index) => (
                              <li key={index}>
                                <a href={`${window.location.origin.toString()}/match/${matchId}`} target='_blank' rel='noopener noreferrer'>
                                  MatchID: {matchId}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                        )
                      : (
                        <div>...</div>
                        )}
                  </div>
                </Stack>
              </Stack>
            </Card.Body>
          </Card>
        </Container>
      </>
    )
  }
}
export default LogfileInspector
