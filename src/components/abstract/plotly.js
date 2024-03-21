import Plot from 'react-plotly.js'

const Plotly = ({ data, title = '', layout = {}, onClick = () => {} }) => {
  return (
    <Plot
      onClick={onClick}
      className='plotly-plot'
      data={data}
      layout={{
        ...{
          title: title,
          font: { size: 16 },
          showlegend: false,
          hovermode: false
        },
        ...layout
      }}
      useResizeHandler
    />
  )
}

export default Plotly
