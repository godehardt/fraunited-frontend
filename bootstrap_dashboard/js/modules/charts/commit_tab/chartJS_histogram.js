/**
 * this async method manages the localStorage/API requests and forward to the Chart Builder
 *
 * @param {String} commitId valid CID which is found in the Commit History
 * @param {String} property valid property which supports histogram data
 * @param {String} binSize somewhere between 0 and the max Games played
 */
async function fetchDataHist(commitId, property, binSize) {
  // The String which is the key value for the data in localStorage
  var db_object_name = "histogram" + commitId + property + binSize;
  var data = {};

  if (localData.get(db_object_name) == null) {
    // If we do not have data in the database
    console.log(`No data stored in local_storage for commit_id: ${commitId}`);
    data = await getHistogramData(commitId, property, binSize); // Receive the data for the specified CID, property and bin Size
    localData.set(db_object_name, data);
    console.log(`Data<${typeof data}> saved to local_storage.\nData:\n${data}`);
  } else {
    data = localData.get(db_object_name);
    // Check if Object in Storage contains Request Errors, if so reload
    console.log("0 " + data[0]);
    console.log("1 " + data[1]);

    if (
      JSON.stringify(data[0]).includes("error") ||
      JSON.stringify(data[1]).includes("error")
    ) {
      console.log("Histogram Object was flawed. Reload from Server");
      console.log(JSON.stringify(data[0]));
      console.log(JSON.stringify(data[1]));
      data = await getHistogramData(commitId, property, binSize);
      localData.set(db_object_name, data);
    } else {
      console.log(`Histogram Object was clean`);
    }
  } // The data is already inside our localStorage -> get it -> map it to data

  $(".histogramLoadingSpinner").hide();
  buildHistogram(data, commitId, property, binSize);
}

var localDataset = null;
/**
 * This method is responsible for building the Histogram with Chartjs as plotting library
 *
 * @param {JSON} dataset valid dataset in 2D-Array for both Teams
 * @param {String} binSize somewhere between 0 and the max Games played
 * @param {String} property valid property which supports histogram data
 * @param {String} commitId valid CID which is found in the Commit History
 */
function buildHistogram(dataset, commitId, property, binSize) {
  localDataset = dataset;

  //console.log("buildHistogram " + dataset);
  // creating the x-Axis labels
  var lab = [];
  for (var i = 1; i <= binSize; i++) {
    lab.push(i);
  }
  // retrieving context to build in and creating the new Chart with Chartjs syntax
  const ctxP = document.getElementById("histchart").getContext("2d");
  //console.log("ctxp histo: " + ctxP);
  //console.log("LENGTH IS: " + dataset[0].length);
  window.myHistChart = new Chart(ctxP, {
    type: "line",
    data: {
      labels: lab,
      datasets: [
        {
          label: property + " left",
          data: dataset[0],
          backgroundColor: "#ff6600",
          borderColor: "#ff6600",
          hoverBackgroundColor: "#669900",
          fill: false,
          showLine: true,
          borderWidth: 2,
        },
        {
          label: property + " right",
          data: dataset[1],
          backgroundColor: "#0099ff",
          borderColor: "#0099ff",
          hoverBackgroundColor: "#669900",
          fill: false,
          showLine: true,
          borderWidth: 2,
        },
      ],
    },
    // Graph Options for Layout etc.
    options: {
      onClick: clickEvent,
      annotation: {
        annotations: [
          {
            drawTime: "afterDatasetsDraw",
            type: "line",
            mode: "vertical",
            scaleID: "x-axis-0",
            value: dataset[0].length / 2 + 1,
            borderWidth: 3,
            borderColor: "red",
          },
        ],
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              callback: function (value, index, values) {
                return value + " " + property;
              },
            },
          },
        ],
      },
      responsive: true,
      legend: false,
      title: {
        display: true,
        text: property + " from " + commitId,
      },
      tooltips: {
        position: "average",
        mode: "index",
        intersect: false,
        callbacks: {
          // Use the footer callback to display the sum of the items showing in the tooltip
          footer: function (tooltipItems, data) {
            var diff = 0;

            tooltipItems.forEach(function (tooltipItem) {
              diff -=
                data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
              diff = Math.abs(diff);
            });
            return "Difference: " + diff;
          },
          title: function (tooltipItems) {
            //Return value for title
            return "Bin: " + tooltipItems[0].xLabel;
          },
        },
        footerFontStyle: "normal",
      },
    },
  });
}

/**
 * this method is called upon Build
 */
function requestHistogram() {
  console.log(1);
  // Selecting the input element and get its value
  var cidIn = GLOBAL_CONFIG.commit_id;
  //load the selector Values
  loadSelectors();
  var propertyIn = $("#propertySelectorHistogram")
    .children("option:selected")
    .val();
  var binIn = $("#binSelectorHistogram").children("option:selected").val();
  if (window.myHistChart && window.myHistChart != null) {
    console.log("Window is destroyed. ");
    window.myHistChart.destroy();
  }
  console.log(2);
  fetchDataHist(cidIn, propertyIn, binIn);
}

function clickEvent(evt, item) {
  //console.log("EVENT: chart clicked", evt);
  if (item[0]) {
    var index = item[0]._index;
    console.log("EVENT: Item Index", item[0]._index);

    console.log("VALUE: Left Team: " + localDataset[0][index]);
    console.log("VALUE: Right Team: " + localDataset[1][index]);
  }
}
