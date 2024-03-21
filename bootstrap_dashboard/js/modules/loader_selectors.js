/**
 * This File is used in every Tab to initialize the Selectors inside the card header
 *
 * @author Nils Jorek
 * @since  01.04.2020
 */

/**
 * This method loads the elements out of the config
 * add all Forms that need to be loaded
 */
function loadSelectors() {
  if ($("#propertySelectorHistogram").has("option").length <= 0) {
    $("#propertySelectorHistogram").empty();
    // For Each Chart defined in Object SELECTOR
    Object.keys(SELECTORS).forEach(function (chart, index) {
      // For Each Property Selector
      $.each(GLOBAL_CONFIG.properties, function (i, p) {
        $(`#propertySelector${chart}`).append(
          $("<option></option>").val(p).html(p)
        );
        //if default Property selected
        if (SELECTORS[`${chart}`]["defaultProperty"] != false) {
          $(`#propertySelector${chart}`).val(
            SELECTORS[`${chart}`]["defaultProperty"]
          );
        }
      });
      // For Each Bin Selector
      $.each(GLOBAL_CONFIG.bins, function (i, p) {
        $(`#binSelector${chart}`).append($("<option></option>").val(p).html(p));
        //if default BinSize selected
        if (SELECTORS[`${chart}`]["defaultBin"] != false) {
          $(`#binSelector${chart}`).val(SELECTORS[`${chart}`]["defaultBin"]);
        }
      });
      // For Each Value Selector
      $.each(GLOBAL_CONFIG.values, function (i, p) {
        $(`#valueSelector${chart}`).append(
          $("<option></option>").val(p).html(p)
        );
        //if default Value selected
        if (SELECTORS[`${chart}`]["defaultValue"] != false) {
          $(`#valueSelector${chart}`).val(
            SELECTORS[`${chart}`]["defaultValue"]
          );
        }
      });
    });
  }
}

/**
 * This Object supports easy insertion of new selectors which are specified via
 * HTML id. Selectors which need the PROPERTIES should be added under the key etc.
 */
const SELECTORS = {
  /**
   * ChartName:{
      property: boolean,
      value: boolean,
      bin: boolean,
      defaultProperty: GLOBAL_CONFIG.properties[defaultProperty],
      defaultValue: GLOBAL_CONFIG.values[defaultValue],
      defaultBin: GLOBAL_CONFIG.bins[defaultBin],
   * }
   */
  Histogram: {
    property: true,
    value: false,
    bin: true,
    defaultProperty: GLOBAL_CONFIG.properties[0],
    defaultValue: false,
    defaultBin: GLOBAL_CONFIG.bins[0],
  },
  Box: {
    property: true,
    value: false,
    bin: false,
    defaultProperty: GLOBAL_CONFIG.properties[6],
    defaultValue: false,
    defaultBin: false,
  },
  HorizontalBar: {
    property: true,
    value: false,
    bin: false,
    defaultProperty: GLOBAL_CONFIG.properties[1],
    defaultValue: false,
    defaultBin: false,
  },
  PieChart: {
    property: true,
    value: false,
    bin: false,
    defaultProperty: GLOBAL_CONFIG.properties[8],
    defaultValue: false,
    defaultBin: false,
  },
  AllCommitsLine: {
    property: true,
    value: true,
    bin: false,
    defaultProperty: GLOBAL_CONFIG.properties[0],
    defaultValue: GLOBAL_CONFIG.values[3],
    defaultBin: false,
  },
};
