import { getProperties as props } from './plotly'

export const getProperties = () => props([
  'goals',
  'ball_on_side',
  'offsides',
  'total_shots',
  'yellow_cards',
  'shots_on_target',
  'passes',
  'possession',
  'red_cards',
  'free_kicks',
  'tackles',
  'pass_chains'
])

export const getHistogramProperties = () => props([
  'goals',
  'fouls',
  'corners',
  'offsides',
  'yellow_cards',
  'red_cards',
  'free_kicks',
  'tackles'
])

export const getHistogramData = (data, property, binSize, batchData) => ({
  labels: [...Array(parseInt(binSize)).keys()].map(label => ++label),
  datasets: [
    {
      label: batchData && batchData.team_l ? batchData.team_l : property + ' left',
      data: data[0],
      backgroundColor: '#ff6600',
      borderColor: '#ff6600',
      hoverBackgroundColor: '#669900',
      fill: false,
      showLine: true,
      borderWidth: 2,
      tension: 0.4
    },
    {
      label: batchData && batchData.team_r ? batchData.team_r : property + ' right',
      data: data[1],
      backgroundColor: '#0099ff',
      borderColor: '#0099ff',
      hoverBackgroundColor: '#669900',
      fill: false,
      showLine: true,
      borderWidth: 2,
      tension: 0.4
    }
  ]
})

// TODO: round corners
export const getHistogramOptions = (data, matchBatch, property) => ({
  scales: {
    y: {
      ticks: {
        beginAtZero: true,
        callback: (value) => `${value} ${property}`
      }
    }
  },
  plugins: {
    tooltip: {
      position: 'average',
      mode: 'index',
      intersect: false,
      callbacks: {
        footer: (context) => `DIFFERENCE ${Math.abs(context[0].raw - context[1].raw)}`,
        title: (context) => `BIN ${context[0].label}`
      },
      footerFontStyle: 'normal'
    },
    annotation: {
      annotations: {
        one: {
          type: 'line',
          xMin: data[0].length / 2,
          xMax: data[0].length / 2,
          borderColor: 'red',
          drawTime: 'afterDatasetsDraw',
          borderWidth: 2
        }
      }
    },
    title: {
      display: false,
      text: `${property} FROM ${matchBatch.team_l} vs ${matchBatch.team_r}`
    }
  }
})

/* ~~~ HISTOGRAM DATA ~~~ (end) */
