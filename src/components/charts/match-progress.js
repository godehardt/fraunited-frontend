import Box from '../layout/box'
import Plotly from '../abstract/plotly'
import React, { useEffect, useState } from 'react'
import { getProperties, PLOTLY_CONFIG } from '../../utils/plotly'

const MatchProgress = ({ data }) => {
  const [plotData, setPlotData] = useState(null)
  const properties = getProperties([
    'corners',
    'fouls',
    'free_kicks',
    'goals',
    'offsides',
    'red_cards',
    'tackles',
    'yellow_cards'
  ])

  useEffect(() => {
    if (!data) return

    let xL = []
    let xR = []
    let yL = []
    let yR = []

    for (const column in properties) {
      xL = xL.concat(data[column + '_l'])
      xR = xR.concat(data[column + '_r'])
      yL = yL.concat((properties[column] + '#').repeat(data[column + '_l'].length).split('#'))
      yL.pop()
      yR = yR.concat((properties[column] + '#').repeat(data[column + '_r'].length).split('#'))
      yR.pop()
    }

    const dataL = {
      type: 'scatter',
      x: xL,
      y: yL,
      mode: 'markers',
      name: data.team_l,
      marker: {
        color: PLOTLY_CONFIG.color.opponent,
        symbol: 'circle',
        size: 8,
        line: {
          color: 'rgba(217, 217, 217, 1.0)',
          width: 1
        }
      }
    }
    const dataR = {
      type: 'scatter',
      x: xR,
      y: yR,
      mode: 'markers',
      name: data.team_r,
      marker: {
        color: PLOTLY_CONFIG.color.fra_uas,
        symbol: 'circle',
        size: 8,
        line: {
          color: 'rgba(217, 217, 217, 1.0)',
          width: 1
        }
      }
    }

    setPlotData([dataL, dataR])
  }, [data])

  if (!data || !plotData) {
    return (
      <>
        'no data'
      </>
    )
  }

  return (
    <Box header='Match Progression'>
      <Plotly
        data={plotData}
        layout={{
          hovermode: 'closest',
          xaxis: {
            range: [0, 6000]
          },
          yaxis: {
            autorange: false,
            type: 'category',
            categoryorder: 'array',
            categoryarray: Object.values(properties)
          }
        }}
      />
    </Box>
  )
}

export default MatchProgress
