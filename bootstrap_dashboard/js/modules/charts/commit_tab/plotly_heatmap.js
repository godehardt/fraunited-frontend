/**
 * Plotly Bar Chart class
 */
class Heatmap extends IChart {
  element_id = "heatmap";

  layout = {
    font: { size: 16 },
    margin: { t: 10, b: 40, l: 40, r: 10 },
  };

  prepareData(commitData) {
    this.plotData = [
      {
        z: [
          [1, null, 30, 50, 1],
          [20, 1, 60, 80, 30],
          [30, 60, 1, -10, 20],
          [20, 1, 60, 80, 30],
          [30, 60, 1, -10, 20],
        ],
        x: ["1", "2", "3", "4", "5"],
        y: ["E", "D", "C", "B", "A"],
        type: "heatmap",
        hoverongaps: false,
      },
    ];
  }

  constructor(commitData) {
    super();
    this.create(commitData);
  }
}
