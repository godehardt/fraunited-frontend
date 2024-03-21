import Box from '../layout/box'
import Plotly from '../abstract/plotly'
import React, { useEffect, useState } from 'react'
import { PLOTLY_CONFIG, defaultProps } from '../../utils/plotly'

const Comparison = ({ data }) => {
  const [plotData, setPlotData] = useState(null)
  const properties = defaultProps()

  useEffect(() => {
    if (!data) return

    const baseL = []
    const dataL = []
    const dataR = []
    const textL = []
    const textR = []

    let leftItem = 0
    let rightItem = 0
    let normalizationFactor = 0

    for (const value in properties) {
      try {
        leftItem = data[value + '_l'].avg
        rightItem = data[value + '_r'].avg

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
        textL.push(leftItem.toFixed(2))
        textR.push(rightItem.toFixed(2))
      } catch (e) {
        console.log('ERROR: ' + value + e)
      }
    }

    const teamL = {
      x: dataL,
      y: Object.values(properties),
      text: textL,
      base: baseL,
      name: data.team_l,
      orientation: 'h',
      type: 'bar',
      hovertemplate: 'Avg=%{text}',
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
      text: textR,
      base: 0,
      name: data.team_r,
      orientation: 'h',
      type: 'bar',
      hovertemplate: 'Avg=%{text}',
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
    return (<>'no data'</>)
  }

  return (
    <Box header='Team Comparison'>
      <Plotly
        data={plotData}
        layout={{
          margin: { t: 0, b: 0, l: 130, r: 30 },
          barmode: 'stack',
          legend: { orientation: 'h' },
          xaxis: { side: 'top' },
          hovermode: 'y unified',
          showlegend: true
        }}
      />
    </Box>
  )
}

export default Comparison
