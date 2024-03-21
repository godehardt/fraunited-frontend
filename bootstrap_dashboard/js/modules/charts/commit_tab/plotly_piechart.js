/**
 * Plotly Pie Chart class
 */
class PieChart extends IChart {
  element_id = "pieChart";

  layout = {
    //title: "Bar Chart",
    font: { size: 16 },
    showlegend: false,
    hovermode: false,
    margin: { t: 10, b: 10, l: 20, r: 20 },
  };

  prepareData(commitData, propertyName) {
    //let labels = [commitData.team_r, commitData.team_l, "Ties"];
    let valuesArr = PlotData.getDualProperty(commitData, propertyName);

    this.plotData = [
      {
        type: "pie",
        values: [valuesArr[0].avg, valuesArr[1].avg],
        labels: [commitData.team_l, commitData.team_r],
        textinfo: "label+percent",
        textposition: "inside",
        marker: {
          colors: [PLOTLY_CONFIG.color.opponent, PLOTLY_CONFIG.color.fra_uas],
          line: {
            width: PLOTLY_CONFIG.data.line_width,
          },
        },
        hoverinfo: false,
      },
    ];
  }

  constructor(commitData, propertyName) {
    super();
    this.create(commitData, propertyName);
  }
}
