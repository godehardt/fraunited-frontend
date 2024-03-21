/**
 * Chart factory, choose with api to use
 * root class
 */
class SuperChart {
  constructor() {}

  static create(api, chart_type, property_name, plot_data) {
    if (api == "chartjs")
      return ChartJS.create(chart_type, property_name, plot_data);
    if (api == "plotly")
      return PlotlyChart.create(chart_type, property_name, plot_data);
  }
}

class ChartJS {
  //TODO: chartjs factory
}

/**
 * Chart factory, creates the right Plotly chart, depending on input parameter
 */
class PlotlyChart {
  constructor() {}

  static create(chart_type, property_name, plot_data) {
    PlotData.getDualProperty(plot_data, "shots_on_target");

    if (chart_type == "barchart") return new BarChart(property_name, plot_data);
    else if (chart_type == "match_barchart")
      return new M_BarChart(property_name, plot_data);
    else if (chart_type == "boxplot")
      return new Boxplot(property_name, plot_data);
    else if (chart_type == "horizontalBar")
      return new HorizontalBar(property_name, plot_data);
    else if (chart_type == "match_horizontalBar")
      return new M_HorizontalBar(property_name, plot_data);
    else if (chart_type == "pieChart")
      return new PieChart(property_name, plot_data);
    else if (chart_type == "comparisonChart")
      return new ComparisonChart(property_name, plot_data);
    else if (chart_type == "match_comparisonChart")
      return new M_ComparisonChart(property_name, plot_data);
    else if (chart_type == "radarChart")
      return new RadarChart(property_name, plot_data);
    else if (chart_type == "match_Matchprogression")
      return new M_Progression(property_name, plot_data);
    //else if (chart_type == "heatmap") return new Heatmap(plot_data);
    //no data available -> disabled
    else console.log("ERROR: Chart-Type not found!");
  }
}

/**
 * Pseudo Interface classe, implements methodes used by all charts
 */
class IChart {
  plotData = null;
  /**
   * Adapt data for Plotly API
   * Class/Chart spezific
   * @param {json} plot_data
   */
  prepareData(commitData, propertyName) {}

  /**
   * Create and display a Plotly Chart
   * @param {json} commitData
   */
  create(propertyName, commitData) {
    try {
      this.prepareData(commitData, propertyName);
      Plotly.newPlot(
        this.element_id,
        this.plotData,
        $.extend(this.layout, PLOTLY_CONFIG.layout),
        PLOTLY_CONFIG.config
      );
      //console.log(this.element_id + " created.");
    } catch (error) {
      console.log(
        "- ERROR: Could not create: " + this.element_id + "\n\n" + error
      );
    }
  }

  /**
   * Override existing Plotly Chart and display new data
   * @param {json} plot_data
   */
  update(plot_data, propertyName) {
    this.prepareData(plot_data, propertyName);

    Plotly.react(
      this.element_id,
      this.plotData,
      $.extend(this.layout, PLOTLY_CONFIG.layout),
      PLOTLY_CONFIG.config
    );
    console.log(this.element_id + " updated.");
  }
}
