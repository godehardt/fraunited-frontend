import Box from '../layout/box'
import Plot from 'react-plotly.js'
import { PLOTLY_CONFIG } from '../../utils/plotly'
import { useState } from 'react'

const AllWinComparison = ({ commitStatistics }) => {
  // Function to extract the team name without version number
  function extractTeamName (team) {
    return team.split(/[0-9]/)[0]
  }

  function getPlotData () {
    const plotData = {
      commitIds: [],
      wins: [],
      ties: [],
      pointsInPercent: [],
      teams: []
    }

    for (const commit of commitStatistics) {
      commit.at(0).statistics.team_l = extractTeamName(commit.at(0).statistics.team_l)
      commit.at(0).statistics.team_r = extractTeamName(commit.at(0).statistics.team_r)
      plotData.commitIds.push(commit.at(0)._id)

      if (commit.at(0).statistics.team_l === 'FRA-UNIted') {
        plotData.teams.push(commit.at(0).statistics.team_r)
      } else {
        plotData.teams.push(commit.at(0).statistics.team_l)
      }
      plotData.teams.push('test')
    }
    plotData.teams = Array.from(new Set(plotData.teams)) // delete duplicate teams
    for (const commit of commitStatistics) {
      const totalGames = commit.at(0).statistics.nmatches
      let idx = 0
      for (const team of plotData.teams) {
        plotData.wins.push([])
        plotData.ties.push([])
        plotData.pointsInPercent.push([])
        if (commit.at(0).statistics.team_l === team || commit.at(0).statistics.team_r === team) {
          if (commit.at(0).statistics.team_l === 'FRA-UNIted') {
            plotData.wins.at(idx).push(commit.at(0).statistics.wins.l / totalGames * 100)
            plotData.ties.at(idx).push(commit.at(0).statistics.wins.ties / totalGames * 100)
            plotData.pointsInPercent.at(idx).push((commit.at(0).statistics.wins.ties + 3 * commit.at(0).statistics.wins.l) / (totalGames * 3) * 100)
          } else {
            plotData.wins.at(idx).push(commit.at(0).statistics.wins.r / totalGames * 100)
            plotData.ties.at(idx).push(commit.at(0).statistics.wins.ties / totalGames * 100)
            plotData.pointsInPercent.at(idx).push((commit.at(0).statistics.wins.ties + 3 * commit.at(0).statistics.wins.r) / (totalGames * 3) * 100)
          }
        } else {
          plotData.wins.at(idx).push(0)
          plotData.ties.at(idx).push(0)
          plotData.pointsInPercent.at(idx).push(0)
        }
        idx++
      }
    }
    return plotData
  }

  const plotData = getPlotData()
  const [propertyName, setPropertyName] = useState(plotData.teams.at(0))

  console.log('state')
  console.log(propertyName)

  function getTeamIdx () {
    let tempIdx
    for (let idx = 0; idx < plotData.teams.length; idx++) {
      if (plotData.teams.at(idx) === propertyName) {
        tempIdx = idx
      }
    }
    return tempIdx
  }

  const teamIdx = getTeamIdx()
  return (
    // <Box header='Boxplot' options={properties} state={propertyName} setState={setPropertyName}>
    <Box header='Wins & Ties' options={plotData.teams} state={propertyName} setState={setPropertyName}>
      <Plot
        data={[{
          x: plotData.commitIds,
          y: plotData.wins.at(teamIdx),
          type: 'bar',
          opacity: 0.8,
          mode: 'lines+markers',
          name: 'Wins',
          marker: { color: PLOTLY_CONFIG.color.win }
        }, {
          x: plotData.commitIds,
          y: plotData.ties.at(teamIdx),
          type: 'bar',
          mode: 'lines+markers',
          opacity: 0.4,
          name: 'Ties',
          marker: { color: PLOTLY_CONFIG.color.tie }
        }, {
          x: plotData.commitIds,
          y: plotData.pointsInPercent.at(teamIdx),
          type: 'scatter',
          name: 'Points',
          marker: { color: PLOTLY_CONFIG.color.fra_uas }
        }]}
        layout={{
          barmode: 'stack',
          xaxis: {
            title: 'Commit Id'
          },
          yaxis: {
            title: 'Percent %'
          }
        }}
      />
    </Box>
  )
}

export default AllWinComparison
