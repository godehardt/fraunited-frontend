/* eslint-disable camelcase */
import Box from '../layout/box'
import Plotly from '../abstract/plotly'
import React, { useEffect, useState } from 'react'
import { getProperties, PLOTLY_CONFIG } from '../../utils/plotly'

const AllWinLine = ({ matchBatches }) => {
  const [plotData, setPlotData] = useState(null)
  const [property, setProperty] = useState('goals')
  const [selector, setSelector] = useState('avg')
  const selectors = {
    avg: 'Average',
    min: 'Minimum',
    max: 'Maximum',
    mean: 'Mean'
  }
  const properties = getProperties([
    'goals',
    'ball_on_side',
    'offsides',
    'total_shots',
    'yellow_cards',
    'shots_on_target',
    'total_shots',
    'passes',
    'possession',
    'red_cards',
    'free_kicks',
    'tackles',
    'pass_chains'
  ])

  useEffect(() => {
    if (!matchBatches) return

    const datax = []
    const score_right = []
    const score_left = []
    const ttscore = []
    const y_right = []
    const y_left = []
    const ttinfo_right = []
    const ttinfo_left = []
    const y_max_r = []
    const y_max_l = []
    const y_min_r = []
    const y_min_l = []

    matchBatches.forEach(matchBatch => {
      if (!matchBatch) return

      const time = new Date(matchBatch.dateCreated).toLocaleDateString(
        'de-DE'
      )
      datax.push(time)
      const score_val_r = (matchBatch.wins.r * 3 + matchBatch.wins.tie) / matchBatch.nmatches
      score_right.push(score_val_r)
      const score_val_l = (matchBatch.wins.l * 3 + matchBatch.wins.tie) / matchBatch.nmatches
      score_left.push(score_val_l)
      ttscore.push(
          `Score ${matchBatch.team_r}: ` +
          score_val_r.toFixed(4) +
          ` <br>Score ${matchBatch.team_l}: ` +
          score_val_l.toFixed(4)
      )
      y_right.push(matchBatch[`${property}_r`])
      y_left.push(matchBatch[`${property}_l`])
      y_max_r.push(matchBatch[`${property}_r`].q75.toFixed(2))
      y_max_l.push(matchBatch[`${property}_l`].q75.toFixed(2))
      y_min_r.push(matchBatch[`${property}_r`].q25.toFixed(2))
      y_min_l.push(matchBatch[`${property}_l`].q25.toFixed(2))
      ttinfo_right.push(
        'TeamName: ' +
            matchBatch.team_r +
            ` <br>${property}_r ${selector} Value: ` +
            matchBatch[`${property}_r`][selector].toFixed(2) +
            ` <br>${property}_r q75 Value: ` +
            matchBatch[`${property}_r`].q75.toFixed(2) +
            ` <br>${property}_r q25 Value: ` +
            matchBatch[`${property}_r`].q25.toFixed(2)
      )
      ttinfo_left.push(
        'TeamName: ' +
            matchBatch.team_l +
            ` <br>${property}_l ${selector} Value: ` +
            matchBatch[`${property}_l`][selector].toFixed(2) +
            ` <br>${property}_l q75 Value: ` +
            matchBatch[`${property}_l`].q75.toFixed(2) +
            ` <br>${property}_l q25 Value: ` +
            matchBatch[`${property}_l`].q25.toFixed(2)
      )
    })

    const val_r = y_right.map((el) => {
      return el[`${selector}`].toFixed(2)
    })

    const score_r = {
      type: 'line',
      x: datax,
      y: score_right,
      line: {
        width: 3,
        color: 'red'
      },
      hovertext: ttscore,
      text: score_right,
      textposition: 'auto',
      hoverinfo: 'text'
    }
    const score_l = {
      type: 'line',
      x: datax,
      y: score_left,
      line: {
        width: 3,
        color: 'red'
      },
      text: score_left,
      textposition: 'auto',
      hoverinfo: 'none'
    }

    const upper_r = {
      x: datax,
      y: y_max_r,
      line: {
        width: 2,
        color: PLOTLY_CONFIG.color.fra_uas
      },
      mode: 'markers',
      marker: {
        symbol: 'diamond',
        opacity: '0.75'
      },
      showlegend: false,
      type: 'scatter',
      hoverinfo: 'none'
    }

    const upper_l = {
      x: datax,
      y: y_max_l,
      line: {
        width: 2,
        color: PLOTLY_CONFIG.color.opponent
      },
      marker: {
        opacity: 0.75
      },
      hoverinfo: 'none',
      mode: 'markers',
      type: 'scatter'
    }

    const lower_r = {
      x: datax,
      y: y_min_r,
      line: {
        width: 2,
        color: PLOTLY_CONFIG.color.fra_uas
      },
      marker: {
        symbol: 'diamond',
        opacity: '0.75'
      },
      hoverinfo: 'none',
      mode: 'markers',
      type: 'scatter'
    }

    const lower_l = {
      x: datax,
      y: y_min_l,
      line: {
        width: 2,
        color: PLOTLY_CONFIG.color.opponent
      },
      marker: {
        opacity: 0.75
      },
      hoverinfo: 'none',
      mode: 'markers',
      type: 'scatter'
    }

    const dataset_r = {
      type: 'line',
      x: datax,
      y: val_r,
      line: {
        width: 2,
        color: PLOTLY_CONFIG.color.fra_uas
      },
      marker: {
        symbol: 'diamond',
        opacity: '0.75'
      },
      hovertext: ttinfo_right,
      text: y_right,
      textposition: 'auto',
      hoverinfo: 'text'
    }

    const val_l = y_left.map((el) => {
      return el[`${selector}`].toFixed(2)
    })

    const dataset_l = {
      type: 'line',
      x: datax,
      y: val_l,
      line: {
        width: 2,
        color: PLOTLY_CONFIG.color.opponent
      },
      hovertext: ttinfo_left,
      text: y_left,
      textposition: 'auto',
      hoverinfo: 'text'
    }

    const plotData = [score_r, score_l, lower_r, dataset_r, upper_r, lower_l, dataset_l, upper_l]

    setPlotData(plotData)
  }, [matchBatches])

  if (!matchBatches || !plotData) {
    return (<></>)
  }

  return (
    <Box
      header='Commit Comparison Chart'
      dropdowns={
        [
          {
            options: properties,
            state: property,
            setState: setProperty
          },
          {
            options: selectors,
            state: selector,
            setState: setSelector
          }
        ]
      }
    >
      <Plotly
        data={plotData}
        layout={{
          yaxis: {
            title: `${selectors[selector]} value of ${properties[property]}`,
            titlefont: {
              size: 16,
              color: 'rgb(107, 107, 107)'
            }
          },
          autosize: true,
          showlegend: false,
          font: { size: 16 },
          margin: { t: 10, b: 50, l: 50, r: 10 },
          barmode: 'group',
          bargap: 0.15,
          bargroupgap: 0.1,
          hovermode: 'x'
        }}
      />
    </Box>
  )
}

export default AllWinLine
