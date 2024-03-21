import Box from '../layout/box'
import Plotly from '../abstract/plotly'
import React, { useEffect, useState } from 'react'
import { PLOTLY_CONFIG, getDualProperty, defaultProps } from '../../utils/plotly'

const Boxplot = ({ data }) => {
  const [plotData, setPlotData] = useState(null)
  const [propertyName, setPropertyName] = useState('goals')
  const properties = defaultProps()

  useEffect(() => {
    if (!data) return
    const valuesArr = getDualProperty(data, propertyName)

    setPlotData(valuesArr.map(boxplot => {
      return {
        type: 'box',
        lowerfence: [boxplot.min],
        q1: [boxplot.q25],
        median: [boxplot.mean],
        q3: [boxplot.q75],
        upperfence: [boxplot.max],
        fillcolor: boxplot.color,
        line: {
          width: PLOTLY_CONFIG.data.line_width,
          color: '#000000'
        },
        name: boxplot.label,
        x0: boxplot.label
      }
    }))
  }, [data, propertyName])

  if (!data || !plotData) {
    return (<>'no data'</>)
  }

  return (
    <Box header='Boxplot' options={properties} state={propertyName} setState={setPropertyName}>
      <Plotly
        title={properties[propertyName]}
        data={plotData}
      />
    </Box>
  )
}

export default Boxplot
