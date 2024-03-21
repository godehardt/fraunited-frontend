/**
 * This File is necessary to initialize all the Plots and load the dynamically
 *
 * Changes here may affect a lot of other files such as loader_html and all plots.
 *
 * @author Nils Jorek, Anton Beck
 * @since  01.04.2020
 */

var all_charts = {}; //stores all charts
var match_data = {}; //match data object
var commit_data = {}; //commit data object

/**
 * Initializes all Charts dynamically
 *
 * @see GLOBAL_CONFIG.commit_id, GLOBAL_CONFIG.match_id
 * @fires subroutines which are there for initialization
 */
async function loadCharts() {
  //Get JSONs
  commit_data = await create_commit_data(GLOBAL_CONFIG.commit_id);
  match_data = await create_match_data(GLOBAL_CONFIG.match_id);

  // console.log("commits:", commit_data);
  // console.log("matches:", match_data);

  create_commit_charts(commit_data);
  create_match_charts(match_data);
  $(".commitLoadingSpinner").hide();

  requestHistogram();
  //loadnmatches();
  preparecommitlinechart("wins");
  requestCommitComparisonChart();

  hideCharts(charts_all_commits);
  hideCharts(charts_specific_match);
  //click_specific_match();
}

/**
 * Creates all commit tab charts and stores them in an array
 * @param {json} data
 */
async function create_commit_charts(data) {
  all_charts["barchart"] = SuperChart.create(
    "plotly",
    "barchart",
    "wins",
    data
  );
  all_charts["boxplot"] = SuperChart.create(
    "plotly",
    "boxplot",
    GLOBAL_CONFIG.properties[6],
    data
  );
  all_charts["horizontalBar"] = SuperChart.create(
    "plotly",
    "horizontalBar",
    GLOBAL_CONFIG.properties[1],
    data
  );
  all_charts["pieChart"] = SuperChart.create(
    "plotly",
    "pieChart",
    GLOBAL_CONFIG.properties[8],
    data
  );
  all_charts["comparisonChart"] = SuperChart.create(
    "plotly",
    "comparisonChart",
    "all",
    data
  );
  all_charts["radarChart"] = SuperChart.create(
    "plotly",
    "radarChart",
    "all",
    data
  );
}

/**
 * Creates all match tab charts and stores them in an array
 * @param {json} data
 */
async function create_match_charts(data) {
  create_match_score(data);
  all_charts["match_comparisonChart"] = SuperChart.create(
    "plotly",
    "match_comparisonChart",
    "all",
    data
  );
  all_charts["match_Matchprogression"] = SuperChart.create(
      "plotly",
      "match_Matchprogression",
      "all",
      data
  );
}

async function create_match_score(data) {
  $("#score_team_r").text(data.team_r);
  $("#score_team_l").text(data.team_l);
  $("#score_values").text(data.goals_r.length + " - " + data.goals_l.length);
  $("#match_score_card").css("color", get_score_color(data.goals_r.length, data.goals_l.length));

}

function get_score_color(goals_r, goals_l) {
    if (goals_r > goals_l) {
        return PLOTLY_CONFIG.color.win;
    } else if (goals_r < goals_l) {
        return PLOTLY_CONFIG.color.lose;
    } else {
        return PLOTLY_CONFIG.color.tie;
    }
}

/**
 * create commit JSON data object
 * @param {String} id commit id
 * @return {Object} Json of Commit Data
 */
async function create_commit_data(id) {
  //console.log("commit id: " + id);
  var commit_id = id;
  var db_object_name = "specificCommit" + commit_id;
  var commitData = {};

  if (localData.get(db_object_name) == null) {
    // If local_storage is empty
    //console.log(`No data stored in local_storage for commit_id: ${commit_id}`);
    commitData = await getSpecificCommit(commit_id); // Fetch data from API
    localData.set(db_object_name, commitData);
    //console.log(`Data<${typeof data}> saved to local_storage.\nData:\n${data}`);
  } else {
    commitData = localData.get(db_object_name); // Get data from local_storage
    //console.log(`Local_storage already contains data of commit: ${commit_id}`);
  }

  return commitData;
}

/**
 * create match JSON data object
 * @param {String} id match id
 * @return {Object} Json of Commit Data
 */
async function create_match_data(id) {
  //console.log("match id: " + id);
  var db_object_name = "SpecificMatch";
  var matchData = {};

  if (localData.get(db_object_name) == null) {
    // If we do not have data in the database
    //console.log(`No data stored in local_storage for commit_id: ${commitId}`);
    matchData = await getJSONforMatch(id); // Receive the data for the specified CID, property and bin Size
    //console.log(`Data<${typeof data}> saved to local_storage.\nData:\n${data}`);
  } else {
    matchData = localData.get(db_object_name);
  } // The data is already inside our localStorage -> get it -> map it to data

  //console.log("JSON-Data:");
  //console.log(matchData);

  return matchData;
  //TODO Build the Plotly Plots for Specific Matches with the ID specified as Parameter
}

/**
 * This function updates the data which is displayed in the specified chart
 * @param {String} chartName must be the id of the HTML class selector inside the form field
 * @param {String} chartSelector, must be the id of the HTML element inside the card headers
 */
function changeChartProperty(chartSelector, chartName) {
  var propertyIn = $(`#${chartSelector}`).children("option:selected").val();

  var commit_id = GLOBAL_CONFIG.commit_id;
  var db_object_name = "specificCommit" + commit_id;

  all_charts[chartName].update(localData.get(db_object_name), propertyIn);
}

/**
 * This method is connected to the syncButton on index.html HEAD
 */
function syncData() {
  localData.clear();
  location.reload();
  return false;
}

/**
 *
 * @param {.rcg} rcgfile , if provided opens the popOut For the Logplayer
 */
function goLogPlayer(rcglink) {
  if (rcglink != null) {
    let link = GLOBAL_CONFIG.logplayer_url.append(rcglink);
    popUp(url);
  } else {
    popUp(GLOBAL_CONFIG.logplayer_url);
  }
}

/**
 * Basic PopUp Window fixed Size
 * @param {String} url whatever url to call
 */
function popUp(url) {
  popupWindow = window.open(
    url,
    "popUpWindow",
    "height=300,width=700,left=50,top=50,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes"
  );
}
