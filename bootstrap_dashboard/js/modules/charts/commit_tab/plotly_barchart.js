/**
 * Plotly Bar Chart class
 */
class BarChart extends IChart {
  element_id = "barChart";

  layout = {
    font: { size: 16 },
    margin: { t: 10, b: 50, l: 50, r: 10 },
  };

  prepareData(commitData, propertyName) {
    let labels = [commitData.team_r, commitData.team_l, "Ties"];

    //let values = [commitData.wins.r, commitData.wins.l, commitData.wins.tie];
    let values = PlotData.getTripleProperty(commitData, propertyName);

    this.plotData = [
      {
        type: "bar",
        x: labels,
        y: values,
        marker: {
          color: [
            PLOTLY_CONFIG.color.fra_uas,
            PLOTLY_CONFIG.color.opponent,
            PLOTLY_CONFIG.color.neutral,
          ],
          line: {
            width: PLOTLY_CONFIG.data.line_width,
          },
        },
        text: values.map(String),
        textposition: "auto",
        hoverinfo: "none",
      },
    ];
  }

  constructor(commitData, propertyName) {
    super();
    this.create(commitData, propertyName);
  }
}
