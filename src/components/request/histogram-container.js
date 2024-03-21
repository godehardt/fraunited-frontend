import { getHistogramData, getHistogramOptions, getHistogramProperties } from '../../utils/chartjs'
import Line from '../charts/line'
import Box from '../layout/box'
import React, { useEffect, useState } from 'react'

const HistogramContainer = ({ dataStatus, dataError, data, matchBatch, property, setProperty, binSize, setBinSize }) => {
  const [histData, setHistData] = useState(undefined)
  let content = (<></>)

  useEffect(() => {
    if (data && !data.status) {
      setHistData(data)
    }
  }, [data])

  if (dataStatus === 'loading') {
    content = <div>Loading...</div>
  }

  if (dataStatus === 'error') {
    content = <div>Error: {dataError.message}</div>
  }

  if (dataStatus === 'success' && histData && Array.isArray(histData) && histData.length !== 2) {
    content = <div>Response invalid!</div>
  } else if (dataStatus === 'success' && histData && matchBatch && data && !data.status) {
    content = (
      <Line
        data={getHistogramData(histData, property, binSize, matchBatch)}
        options={getHistogramOptions(histData, matchBatch, property)}
      />
    )
  } else {
    return (<>'no data'</>)
  }

  return (
    <Box
      className='my-3'
      header='Histogram'
      dropdowns={
        [
          {
            options: getHistogramProperties(),
            state: property,
            setState: setProperty
          },
          {
            options: { 2: 2, 6: 6, 20: 20, 30: 30, 60: 60, 120: 120, 240: 240 },
            state: binSize,
            setState: setBinSize
          }
        ]
      }
    >
      {content}
    </Box>
  )
}

export default HistogramContainer
