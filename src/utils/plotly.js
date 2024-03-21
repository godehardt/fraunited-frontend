export const PLOTLY_CONFIG = {
  data: {
    line_width: 1
  },
  layout: {
    plot_bgcolor: '#ffffff',
    paper_bgcolor: '#ffffff' /* "#d0d6e2" */,
    polar: { bgcolor: '#ffffff' }
  },
  config: {
    responsive: true,
    displaylogo: false
  },
  color: {
    fra_uas: '#2b89cc',
    opponent: '#fd7e14',
    neutral: '#efeeee',
    win: '#3d940d',
    lose: '#cb081e',
    tie: '#3c3c3c'
  }
}

const properties = {
  goals: 'Goals',
  ball_on_side: 'Ball on side',
  offsides: 'Offsides',
  total_shots: 'Total shots',
  yellow_cards: 'Yellow cards',
  shots_on_target: 'Shots on target',
  passes: 'Passes',
  possession: 'Possession',
  red_cards: 'Red cards',
  free_kicks: 'Free kicks',
  tackles: 'Tackles',
  pass_chains: 'Pass chains',
  corners: 'Corners',
  fouls: 'Fouls'
}

export function getProperties (props) {
  const res = {}
  props.forEach(element => {
    res[element] = properties[element] ?? element
  })
  return res
}

export function defaultProps () {
  return getProperties([
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
    'pass_chains',
    'corners',
    'fouls'
  ])
}

export function getDualProperty (data, property) {
  let finishedData = []

  // set up reference
  const propertyNameL = property + '_l'
  const propertyNameR = property + '_r'

  let propertyDataL = ''
  let propertyDataR = ''

  // get corresponding data
  propertyDataL = data[propertyNameL]
  propertyDataR = data[propertyNameR]

  // feed more data to it
  propertyDataL.label = data.team_l
  propertyDataR.label = data.team_r

  propertyDataL.color = PLOTLY_CONFIG.color.opponent
  propertyDataR.color = PLOTLY_CONFIG.color.fra_uas

  finishedData = [propertyDataR, propertyDataL]

  return finishedData
}

export function getTripleProperty (data, property) {
  // ex. wins and ties
  let finishedData = []

  finishedData = [data[property].r, data[property].l, data[property].ties]
  return finishedData
}
