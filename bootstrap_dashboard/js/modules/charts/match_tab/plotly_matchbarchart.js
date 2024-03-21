/**
 * Plotly Bar Chart class
 */
class M_BarChart extends IChart {
  element_id = "match_BarChart";

  layout = {
    font: { size: 16 },
    margin: { t: 10, b: 50, l: 50, r: 10 },
  };

  prepareData(commitData, propertyName) {
    let labels = [commitData.team_r, commitData.team_l, "goals"];

    //let values = [commitData.wins.r, commitData.wins.l, commitData.wins.tie];
    let values = [commitData.goals_r.length, commitData.goals_l.length];

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
