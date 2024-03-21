import Box from '../layout/box'
import Plotly from '../abstract/plotly'
import React, { useEffect, useState } from 'react'
import { PLOTLY_CONFIG, getTripleProperty } from '../../utils/plotly'

const Ties = ({ data }) => {
  const [plotData, setPlotData] = useState(null)

  useEffect(() => {
    if (!data) return
    const labels = [data.team_r, data.team_l, 'Ties']
    const values = getTripleProperty(data, 'wins')
    const ttvalues = values.map((el) => {
      return data.team_r + ' ' + (el / data.nmatches).toFixed(2)
    })

    setPlotData([
      {
        type: 'bar',
        x: labels,
        y: values,
        marker: {
          color: [
            PLOTLY_CONFIG.color.fra_uas,
            PLOTLY_CONFIG.color.opponent,
            PLOTLY_CONFIG.color.neutral
          ],
          line: {
            width: PLOTLY_CONFIG.data.line_width
          }
        },
        hovertext: ttvalues,
        text: values.map((val) => { return '' + (100 * val / data.nmatches).toFixed(2) + '%' }),
        textposition: 'auto',
        hoverinfo: 'text'
      }
    ])
  }, [data])

  if (!data || !plotData) {
    return (<>'no data'</>)
  }

  return (
    <Box header='Wins & Ties'>
      <Plotly
        data={plotData}
      />
    </Box>
  )
}

export default Ties
