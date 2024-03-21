import Box from '../layout/box'
import Plotly from '../abstract/plotly'
import React, { useEffect, useState } from 'react'
import { PLOTLY_CONFIG, getDualProperty, defaultProps } from '../../utils/plotly'

const Pie = ({ data }) => {
  const [plotData, setPlotData] = useState(null)
  const [propertyName, setPropertyName] = useState('possession')
  const properties = defaultProps()

  useEffect(() => {
    if (!data) return
    const valuesArr = getDualProperty(data, propertyName)

    setPlotData([
      {
        type: 'pie',
        values: [valuesArr[0].avg, valuesArr[1].avg],
        labels: [data.team_r, data.team_l],
        textinfo: 'label+percent',
        textposition: 'inside',
        marker: {
          colors: [PLOTLY_CONFIG.color.fra_uas, PLOTLY_CONFIG.color.opponent],
          line: {
            width: PLOTLY_CONFIG.data.line_width
          }
        },
        hoverinfo: false
      }
    ])
  }, [data, propertyName])

  if (!data || !plotData) {
    return (<>'no data'</>)
  }

  return (
    <Box header='Pie Chart' options={properties} state={propertyName} setState={setPropertyName}>
      <Plotly
        title={properties[propertyName]}
        data={plotData}
      />
    </Box>
  )
}

export default Pie
