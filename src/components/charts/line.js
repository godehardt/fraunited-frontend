import { Line as LineChartJS } from 'react-chartjs-2'
import { Chart } from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'

Chart.register(annotationPlugin)

const Line = ({ data, options }) => <LineChartJS data={data} options={options} />

export default Line
