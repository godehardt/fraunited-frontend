import { useParams } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import CommitContainer from '../request/commit-container'
import CommitHistoryContainer from '../request/commit-history-container'

const CommitView = () => {
  const { commitId } = useParams()

  return (
    <>
      <Container className='my-3'>
        <CommitHistoryContainer commitId={commitId} />
      </Container>
      {
        commitId &&
          <>
            <CommitContainer commitId={commitId} />
          </>
      }
    </>
  )
}

export default CommitView
