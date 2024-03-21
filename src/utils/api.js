import { server, serverBlob } from './request'

/**
 * api call for the commit history
 */
export const fetchCommitHistory = () => {
  return server('/commit/')
}

/**
 * api call for specific commit data
 */
export const fetchCommitData = (commitId) => {
  return server('/commit/' + commitId)
}

/**
 * api call for match data
 */
export const fetchMatchData = (matchId) => {
  return server('/match/' + matchId)
}

export const fetchMatchIndex = (protocolId, index, mongoMatchID) => {
  console.log('fetchMatchIndex: ', protocolId, index, mongoMatchID)
  if (mongoMatchID) {
    return server(`/match/${mongoMatchID}`)
  }
  return (server(`/protocol/${protocolId}/matches.json/${index}`))
}

/**
 * api call for histogram data
 */
export const fetchHistogramData = (protocolId, matchupIds, commitId, property, binSize) => {
  const binSizePath = !binSize ? '' : ('.' + binSize)
  const commitPath = !commitId ? '' : ('/' + commitId)
  return server(`/protocol/${protocolId}/histogram/${property}${binSizePath}${commitPath}`)
}

export const getAllProtocols = () => {
  const res = server('/protocol')
  console.log('GetAllProtocols: ', res)
  return res
}

export const getProtocol = (protocolId) => {
  return server(`/protocol/${protocolId}`)
}

export const getCurrentProtocol = () => {
  return server('/protocol/current')
}

export const createProtocol = (protocol) => {
  const headers = new Headers({
    'Content-Type': 'application/json'
  })

  const protocolAsJson = JSON.stringify(protocol)

  const options = {
    method: 'POST',
    body: protocolAsJson,
    headers: headers
  }

  return server('/protocol', options)
}

export const uploadTeam = (teamname, file, setupScript) => {
  const formData = new FormData()
  formData.append('name', teamname)
  formData.append('zip', file)
  if (setupScript) {
    formData.append('setupScript', setupScript)
  }

  const options = {
    method: 'POST',
    body: formData,
    headers: {}
  }

  return server('/team', options)
}

export const getTeamNames = () => {
  return server('/team')
}

export const deleteTeam = (teamname) => {
  return server(`/team/${teamname}`, { method: 'DELETE' })
}

export const downloadTeam = (teamname) => {
  return serverBlob(`/team/${teamname}/zip`)
}

export const downloadTeamSetupScript = (teamname) => {
  return serverBlob(`/team/${teamname}/sh`)
}

export const downloadLogFiles = (infoId) => {
  return serverBlob(`/logFiles/${infoId}`)
}

export const getAllMatchesInProtocol = (protocolId) => {
  return server(`/protocol/${protocolId}/results/matches`)
}

export const fetchProtocolMatchBatchData = (protocolId) => {
  return server(`/protocol/${protocolId}/results/matches/batch`)
}

export const getAllMatchesForMatchupInProtocol = (protocolId, matchupId) => {
  return server(`/protocol/${protocolId}/results/matches/${matchupId}`)
}

export const fetchProtocolMatchBatchCommitData = (protocolId, matchupId, commitId) => {
  return server(`/protocol/${protocolId}/results/matches/${matchupId}/${commitId}/batch`)
}

export const fetchMatchUpData = (protocolId, matchupId) => {
  return server(
        `/protocol/${protocolId}/results/matches/${matchupId}/batch`
  )
}

export const fetchMatchBatch = (protocolId, matchupIds, commitId) => {
  const headers = new Headers({
    'Content-Type': 'application/json'
  })

  const requestBody = { matchUpIds: matchupIds, commitId: commitId }
  const requestBodyAsJson = JSON.stringify(requestBody)

  const options = {
    method: 'POST',
    body: requestBodyAsJson,
    headers: headers
  }

  return server(
        `/protocol/${protocolId}/results/matches/paramBatch`,
        options
  )
}

export const getLogFileInfos = (protocolId) => {
  return server(`/logFileInfos/${protocolId}`)
}

/**
 * api call to get metadata to specific commit
 */
export const metaRequest = (commit, build = 'lastBuild') => {
  const cacheKey = `metadata/b-${commit}`

  const cacheData = window.localStorage.getItem(cacheKey)
  if (cacheData) {
    build = cacheData
  }

  return server(`job/RoboCup/${build}/api/json`, { auth: true }).then(
    (result) => {
      const items = result.actions
      if (!items.length ||
        !items.find(el => el.lastBuiltRevision && el.lastBuiltRevision.SHA1 === commit)
      ) {
        const buildId = result.number
        if (buildId < 0) throw Error(`no build for ${commit} could be found`)
        return metaRequest(commit, '' + (buildId - 1))
      }

      window.localStorage.setItem(cacheKey, build)

      result.requestedCommit = commit

      return result
    }
  )
}
