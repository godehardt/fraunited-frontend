import Box from '../layout/box'
import Plotly from '../abstract/plotly'
import React, { useEffect, useState } from 'react'
import { PLOTLY_CONFIG, defaultProps } from '../../utils/plotly'

const MatchComparision = ({ data }) => {
  const [plotData, setPlotData] = useState(null)
  const properties = defaultProps()

  useEffect(() => {
    if (!data) return

    const baseL = []
    const dataL = []
    const dataR = []

    let leftItem = 0
    let rightItem = 0
    let normalizationFactor = 0

    for (const value in properties) {
      try {
        if (Array.isArray(data[value + '_l'])) {
          leftItem = data[value + '_l'].length
          rightItem = data[value + '_r'].length
        } else {
          leftItem = data[value + '_l']
          rightItem = data[value + '_r']
        }

        if (leftItem + rightItem > 0) {
          normalizationFactor = 100 / (leftItem + rightItem)
          dataL.push(normalizationFactor * leftItem)
          baseL.push(-normalizationFactor * leftItem)
          dataR.push(normalizationFactor * rightItem)
        } else {
          dataL.push(0)
          baseL.push(0)
          dataR.push(0)
        }
      } catch (e) {
        console.log('ERROR: ' + value + e)
      }
    }

    const teamL = {
      x: dataL,
      y: Object.values(properties),
      base: baseL,
      name: data.team_l,
      orientation: 'h',
      type: 'bar',
      marker: {
        color: PLOTLY_CONFIG.color.opponent,
        width: 1,
        line: {
          width: PLOTLY_CONFIG.data.line_width
        }
      }
    }

    const teamR = {
      x: dataR,
      y: Object.values(properties),
      base: 0,
      name: data.team_r,
      orientation: 'h',
      type: 'bar',
      marker: {
        color: PLOTLY_CONFIG.color.fra_uas,
        width: 1,
        line: {
          width: PLOTLY_CONFIG.data.line_width
        }
      }
    }

    setPlotData([teamL, teamR])
  }, [data])

  if (!data || !plotData) {
    return (
      <>
        'no data'
      </>
    )
  }

  return (
    <Box header='Team Comparision'>
      <Plotly
        data={plotData}
        layout={{
          margin: { t: 0, b: 0, l: 130, r: 30 },
          barmode: 'stack',
          legend: { orientation: 'h' },
          xaxis: { side: 'top' },
          hovermode: true,
          showlegend: true
        }}
      />
    </Box>
  )
}

export default MatchComparision
