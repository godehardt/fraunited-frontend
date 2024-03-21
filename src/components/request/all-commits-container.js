import { fetchCommitHistory, fetchCommitData } from '../../utils/api'
import { useQuery } from 'react-query'
import { Container } from 'react-bootstrap'

import AllWinComparison from '../charts/all-win-comparison'
import React from 'react'

const AllCommitsContainer = () => {
  const { status, data, error } = useQuery('commit-history', fetchCommitHistory)
  console.log('Output')

  console.log(data)

  function getCommitStatistics () {
    const commitStatistics = []
    for (const commit of data) {
      if (commit._id !== '-1') {
        const stats = fetchCommitData(commit._id)
        commitStatistics.push([commit, stats])
      }
    }
    return commitStatistics
  }

  let content
  if (status === 'loading') {
    content = <div>Loading...</div>
  }

  if (status === 'error') {
    content = <div>Error: {error.message}</div>
  }

  if (status === 'success') {
    const commitStatistics = getCommitStatistics()
    content = (
      <>
        <Container className='my-3'>
          <AllWinComparison commitStatistics={commitStatistics} />
        </Container>
      </>
    )
  }

  // const res = useQueries(
  //   tempData.map(commitId => {
  //     return {
  //       queryKey: ['commit', commitId],
  //       queryFn: () => fetchCommitData(commitId)
  //     }
  //   })
  // )
  // console.log("res")
  // console.log(res)
  //
  // const matchBatches = res.map(r => {
  //   if (r.isSuccess && r.data) {
  //     return r
  //   }
  //   // FIXME correct?
  //   return r
  // })

  // let content

  //   <>
  //     {/*<Container className="my-3">*/}
  //     {/*  <AllWinComparison matchBatches={matchBatches}/>*/}
  //     {/*</Container>*/}
  //     {/*/!*<Container className='my-3'>*!/*/}
  //     {/*/!*  <AllWinLine matchBatches={matchBatches} />*!/*/}
  //     {/*/!*</Container>*!/*/}
  //   </>
  // )
  // }

  return (
    <div>
      {content}
    </div>
  )
}

export default AllCommitsContainer
