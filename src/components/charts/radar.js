import Box from '../layout/box'
import Plotly from '../abstract/plotly'
import React, { useEffect, useState } from 'react'
import { PLOTLY_CONFIG, defaultProps } from '../../utils/plotly'

const Radar = ({ data }) => {
  const properties = defaultProps()
  const radius = 100
  const [plotData, setPlotData] = useState(null)

  useEffect(() => {
    if (!data) return

    const radarColumns = [
      'goals',
      'total_shots',
      'shots_on_target',
      'corners',
      'fouls',
      'tackles',
      'free_kicks',
      'passes'
    ]

    const labels = []

    radarColumns.forEach(element => {
      labels.push(properties[element])
    })

    const dataL = []
    const dataR = []

    let leftItem = 0
    let rightItem = 0
    let normalizationFactor = 0

    for (let i = 0; i < radarColumns.length; i++) {
      try {
        leftItem = data[radarColumns[i] + '_l'].avg
        rightItem = data[radarColumns[i] + '_r'].avg

        if (leftItem + rightItem > 0) {
          normalizationFactor = radius / (leftItem + rightItem)
          dataL.push(normalizationFactor * leftItem)
          dataR.push(normalizationFactor * rightItem)
        } else {
          dataL.push(0)
          dataR.push(0)
        }
      } catch (e) {
        console.log('ERROR: i:' + i + ' ' + radarColumns[i] + e)
      }
    }

    setPlotData([
      {
        type: 'scatterpolar',
        r: dataR,
        theta: labels,
        fill: 'toself',
        name: data.team_r,
        marker: {
          color: PLOTLY_CONFIG.color.fra_uas,
          line: {
            width: 0
          }
        }
      },
      {
        type: 'scatterpolar',
        r: dataL,
        theta: labels,
        fill: 'toself',
        name: data.team_l,
        marker: {
          color: PLOTLY_CONFIG.color.opponent,
          line: {
            width: 0
          }
        }
      }
    ])
  }, [data])

  if (!data || !plotData) {
    return (<>'no data'</>)
  }

  return (
    <Box header='Team Behaviour'>
      <Plotly
        data={plotData}
        layout={{
          showlegend: false,
          polar: {
            radialaxis: {
              visible: true,
              range: [0, radius]
            }
          }
        }}
      />
    </Box>
  )
}

export default Radar
