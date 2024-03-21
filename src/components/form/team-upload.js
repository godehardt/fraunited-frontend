import { Accordion, Button, Col, Form, Row, Spinner } from 'react-bootstrap'
import React, { useState } from 'react'
import { getTeamNames, uploadTeam } from '../../utils/api'
import { useQuery } from 'react-query'
import Snackbar from '../layout/snackbar'

const TeamUpload = ({ update }) => {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [file, setFile] = useState(undefined)
  const [filename, setFilename] = useState('')
  const [snackBarMessage, setSnackBarMessage] = useState('')
  const [snackBarStatus, setSnackBarStatus] = useState('')
  const [setupScript, setSetupScript] = useState(undefined)

  // const { status: teamNamesStatus, data: teamNames, error: teamNamesError, refetch: teamNamesRefetch } = useQuery('getTeamNames', getTeamNames)
  const { data: teamNames, refetch: teamNamesRefetch } = useQuery('getTeamNames', getTeamNames)
  // const { status, data, error, refetch, isRefetching } = useQuery('uploadTeam', () => uploadTeam(filename, file), {
  const { status, error, refetch, isRefetching } = useQuery('uploadTeam', () => uploadTeam(filename, file, setupScript), {
    enabled: false,
    retry: false
  })

  function handleFilenameChange (event) {
    setFilename(event.target.value)
  }

  function handleFileChange (event) {
    setFile(event.target.files[0])
  }

  function handleSetupScriptChange (event) {
    setSetupScript(event.target.files[0])
  }

  function onUploadClick () {
    if (teamNames.find(name => name === filename) !== undefined) {
      setSnackBarMessage('Team name already exists')
      setSnackBarStatus('danger')
      setShowConfirmation(true)
    } else if (filename === 'FRA-UNIted-LATEST') {
      setSnackBarMessage('FRA-UNIted-LATEST is a reserved team name for the automatic fetching of the FRA-UNIted team each night')
      setSnackBarStatus('danger')
      setShowConfirmation(true)
    } else if (filename.indexOf('/') !== -1) {
      setSnackBarMessage('Slashes are not allowed in the team name')
      setSnackBarStatus('danger')
      setShowConfirmation(true)
    } else {
      refetch().then(res => {
        setSnackBarMessage('Successfully added Team')
        setSnackBarStatus('primary')
        update(Date.now)
        teamNamesRefetch()
        setShowConfirmation(true)
        setFile(undefined)
        setFilename('')
      })
    }
  }

  let content

  if (status === 'loading' || isRefetching) {
    content = <Spinner animation='border' variant='info' />
  }
  if (status === 'error') {
    content = <div>Error: {error.message}</div>
  }

  if ((status === 'idle' || status === 'success') && !isRefetching) {
    content = (
      <Form>
        <Form.Group as={Row} className='mb-3' controlId='formPlaintextEmail'>
          <Form.Label column sm='2'>
            Teamname
          </Form.Label>
          <Col sm='10'>
            <Form.Control type='text' placeholder='FraUNIted' value={filename} onChange={handleFilenameChange} />
            <Form.Text className='text-muted'>
              Please do not include slashes in the team name
            </Form.Text>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className='mb-3' controlId='formFile'>
          <Form.Label column sm='2'>
            Team.zip
          </Form.Label>
          <Col sm='10'>
            <Form.Control type='file' onChange={handleFileChange} />
            <Form.Text className='text-muted'>
              The zip has to contain the team files, such that 'unzip the_zip_file.zip -d target_folder' produces 'target_folder' containing the start, startAll and kill scripts of the team
            </Form.Text>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className='mb-3' controlId='formFile'>
          <Form.Label column sm='2'>
            Team setup script
          </Form.Label>
          <Col sm='10'>
            <Form.Control type='file' onChange={handleSetupScriptChange} />
            <Form.Text className='text-muted'>
              The script uploaded here is executed after the team is unpacked on a test computer at the beginning of
              starting the matches. The script is called with 2 cli arguments: "yourScript.sh /path/to/team/folder/
              teamname" This file is optional.
            </Form.Text>
          </Col>
        </Form.Group>

        <Button variant='primary' disabled={filename === undefined || file === undefined} onClick={() => onUploadClick()}>
          Upload
        </Button>
        <Snackbar setShow={setShowConfirmation} show={showConfirmation} status={snackBarStatus} message={snackBarMessage} />
      </Form>
    )
  }

  return (
    <Accordion>
      <Accordion.Item eventKey='0'>
        <Accordion.Header>
          Team Upload
        </Accordion.Header>
        <Accordion.Body>
          {content}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}

export default TeamUpload
