import { metaRequest } from '../../utils/api'
import { useQuery } from 'react-query'
import { Button, ButtonGroup, ListGroup, Table } from 'react-bootstrap'
import TimeAgo from 'timeago-react'
import ModalButton from '../layout/modal-button'
import Box from '../layout/box'
import ObjectTree from '../layout/object-tree'
import DownloadButton from '../form/download-button'
import React from 'react'

const MetaContainer = ({ commitId, commitData }) => {
  const { status, data, error } = useQuery(
    ['commit-meta', commitId],
    () => metaRequest(commitId),
    {
      cacheTime: 5 * 60 * 1000
    }
  )

  let commitContent = (<></>)
  if (commitData) {
    commitContent = (
      <>
        <Table bordered hover>
          <thead>
            <tr>
              <th colSpan='2'>{commitData.team_l} vs {commitData.team_r}</th>
            </tr>
          </thead>
          <tbody>

            <tr>
              <td>Total Matches</td>
              <td>{commitData.nmatches}</td>
            </tr>

            <tr>
              <td>Commit Id</td>
              <td>{commitData.commitID}</td>
            </tr>
          </tbody>
        </Table>
      </>
    )
  }

  let headerContent = (<></>)
  if (status === 'success') {
    headerContent = (
      <>
        {headerContent}
        <ModalButton button={<i className='bi bi-file-bar-graph' />}>
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <h5>Metadata</h5>
            <DownloadButton name={`Metadata_${data.id}`} content={data} />
          </div>

          <div className='border py-2'>
            <ObjectTree title='test' object={data} first />
          </div>
        </ModalButton>
      </>
    )
  }

  if (commitData) {
    headerContent = (
      <>
        {headerContent}
        <ModalButton button={<i className='bi bi-file-code' />}>
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <h5>Commit</h5>
            <DownloadButton name={`Commit_${commitData.commitID.substr(0, 8)}`} content={commitData} />
          </div>

          <div className='border py-2'>
            <ObjectTree title='test' object={commitData} first />
          </div>
        </ModalButton>
      </>
    )
  }

  let content

  if (status === 'error') {
    content = <div>Error: {error.message}</div>
  } else if (status === 'loading') {
    content = <div>Loading...</div>
  } else {
    content = (
      <>
        {data.changeSet?.items
          ? (
            <ListGroup>
              {data.changeSet.items.slice(0).reverse().map((commit) =>
                (
                  <ListGroup.Item key={commit.id} className='d-flex w-100 justify-content-between align-items-center'>
                    <div>
                      <div>
                        <h5 className='mb-1'><span className='link-dark text-decoration-none'>{commit.msg}</span></h5>
                      </div>
                      <p className='mb-1'>
                        <span className='link-dark text-decoration-none'>{commit.author.fullName} </span>
                        <small>authored <TimeAgo datetime={commit.timestamp} /> ({data.fullDisplayName.charAt(0).toUpperCase() + data.fullDisplayName.slice(1)}) </small>
                      </p>
                    </div>
                    <ButtonGroup size='sm' className='ms-2'>
                      <Button variant='outline-primary font-monospace' onClick={() => navigator.clipboard.writeText(commit.id)}>{commit.id.substr(0, 8)}</Button>
                    </ButtonGroup>
                  </ListGroup.Item>
                )
              )}
            </ListGroup>
            )
          : ''}

      </>
    )
  }

  const header = (
    <><span>Metadata</span><div className='d-flex order-2'>{headerContent}</div></>
  )

  return (
    <Box header={header}>
      {commitContent}
      {content}
    </Box>

  )
}

export default MetaContainer
