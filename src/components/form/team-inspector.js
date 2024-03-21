import React from 'react'
import { Button, Card, Spinner, Table } from 'react-bootstrap'
import { useQuery } from 'react-query'
import { deleteTeam, downloadTeam, downloadTeamSetupScript, getTeamNames } from '../../utils/api'
import { MdDownload, MdDelete } from 'react-icons/md'

const TeamInspector = ({ update }) => {
  // const { status, data, error, refetch } = useQuery('getTeamNames', getTeamNames)
  const { status, data, error, refetch } = useQuery('getTeamNames', getTeamNames)

  function onDeleteTeamClick (teamName) {
    if (window.confirm(`Do you really want to delete team ${teamName}?`)) {
      deleteTeam(teamName).then(res => {
        update()
        refetch()
      })
    }
  }

  function onDownloadTeamClick (teamName) {
    downloadTeam(teamName).then(res => {
      // Create blob link to download
      const url = window.URL.createObjectURL(
        new Blob([res])
      )
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
                `${teamName}.zip`
      )

      // Append to html link element page
      document.body.appendChild(link)

      // Start download
      link.click()

      // Clean up and remove the link
      link.parentNode.removeChild(link)
    })
  }

  function OnDownloadSetUpScriptClick (teamName) {
    downloadTeamSetupScript(teamName).then(res => {
      // Create blob link to download
      const resBlob = new Blob([res])

      const url = window.URL.createObjectURL(resBlob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        `${teamName}.sh`
      )

      // Append to html link element page
      document.body.appendChild(link)

      // Start download
      link.click()

      // Clean up and remove the link
      link.parentNode.removeChild(link)
    })
  }

  let content

  if (status === 'loading') {
    content = <Spinner animation='border' variant='info' />
  }
  if (status === 'error') {
    content = <div>Error: {error.message}</div>
  }

  if (status === 'success') {
    content = (
      <Card className='h-100'>
        <Card.Body>
          <Table striped borderless>
            <thead>
              <tr>
                <th>Name</th>
                <th>Team Binary</th>
                <th>Setup Script</th>
                <th>Remove Team</th>
              </tr>
            </thead>
            <tbody>
              {
                data.map(value => {
                  return (
                    <tr key={value._id}>
                      <td>{value.name}</td>
                      <td>
                        <Button variant='light' onClick={() => onDownloadTeamClick(value.name)}><MdDownload /></Button>
                      </td>
                      <td>
                        {value.scriptpath
                          ? <Button variant='light' onClick={() => OnDownloadSetUpScriptClick(value.name)}><MdDownload /></Button>
                          : <></>}
                      </td>
                      <td>
                        <Button variant='dark' onClick={() => onDeleteTeamClick(value.name)}><MdDelete /></Button>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    )
  }

  return <>{content}</>
}

export default TeamInspector
