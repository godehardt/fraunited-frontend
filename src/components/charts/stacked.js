import Box from '../layout/box'
import Plotly from '../abstract/plotly'
import { useEffect, useState } from 'react'
import { PLOTLY_CONFIG, getDualProperty, properties } from '../../utils/plotly'

const Stacked = ({ data }) => {
  const [plotData, setPlotData] = useState(null)
  const [propertyName, setPropertyName] = useState('ball_on_side')

  useEffect(() => {
    if (!data) return
    const valuesArr = getDualProperty(data, propertyName)

    const shortValues = [valuesArr[0].avg.toFixed(1), valuesArr[1].avg.toFixed(1)]

    const teamL = {
      x: [shortValues[0]],
      y: [''],
      name: data.team_l,
      orientation: 'h',
      type: 'bar',
      text: [shortValues[0] + '% '],
      textposition: 'auto',
      marker: {
        color: PLOTLY_CONFIG.color.opponent,
        width: 1,
        line: {
          width: PLOTLY_CONFIG.data.line_width
        }
      }
    }

    const teamR = {
      x: [shortValues[1]],
      y: [''],
      name: data.team_r,
      orientation: 'h',
      type: 'bar',
      text: [shortValues[1] + '% '],
      textposition: 'auto',
      marker: {
        color: PLOTLY_CONFIG.color.fra_uas,
        width: 1,
        line: {
          width: PLOTLY_CONFIG.data.line_width
        }
      }
    }

    setPlotData([teamR, teamL])
  }, [data, propertyName])

  if (!data || !plotData) {
    return 'no data'
  }

  return (
    <Box header='Stacked Bar Chart' options={properties} state={propertyName} setState={setPropertyName}>
      <Plotly
        title={properties[propertyName]}
        data={plotData}
        layout={{
          barmode: 'stack',
          legend: { orientation: 'h', traceorder: 'normal' },
          xaxis: {
            visible: false
          }
        }}
      />
    </Box>
  )
}

export default Stacked
