import { fetchCommitHistory, metaRequest } from '../../utils/api'
import { useHistory } from 'react-router-dom'
import { useQuery, useQueries } from 'react-query'
import { format } from 'timeago.js'

import Dropdown from '../form/dropdown'

const CommitHistoryContainer = ({ commitId }) => {
  const history = useHistory()

  const updateRoute = (id) => {
    history.push(`${process.env.PUBLIC_URL}/commit/${id}`)
  }

  const { status, data, error } = useQuery('commit-history', fetchCommitHistory)

  const tempData = data ?? []

  const res = useQueries(
    tempData.map(commitId => {
      return {
        queryKey: ['commit-meta', commitId],
        queryFn: () => metaRequest(commitId),
        enabled: false,
        placeholderData: () => { return { requestedCommit: commitId } }
      }
    })
  )

  const options = {}
  tempData.forEach(element => {
    const meta = res.find(r => r.status === 'success' && r.data.requestedCommit === element)
    if (meta && meta.data && meta.data.id) {
      options[element] = `[${element.substr(0, 8)}] ${meta.data.fullDisplayName} ${format(meta.data.timestamp)}`
    } else {
      options[element] = element
    }
  })

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
        <Dropdown options={options} placeholder='Select Commit' state={commitId} setState={updateRoute} />
      </>
    )
  }

  return (
    <div>
      {content}
    </div>
  )
}

export default CommitHistoryContainer
