/**
 * tabs_logic.js
 * Controls what charts to show and what to hide
 *
 */

//Array with all match tab chart IDs
const charts_specific_match = [
  "match_comparisonchart_card",
  "matchForm",
  "match_matchprogression_card",
  "match_score_card"
];

//Array with first tab chart IDs
const charts_all_commits = [
  "all_linechart_card",
  "all_comparisonchart_card",
];

//Array with all commit tab chart IDs
const charts_specific_commit = [
  "horizontalbarchart_card",
  "barchart_card",
  "comparisonchart_card",
  "boxplotchart_card",
  "radarchart_card",
  "piechart_card",
  //"heatmapchart_card",
  "metadata",
  //"linechart_card",
  "histogramchart_card",
  "dropdownMenuButton",
];

/**
 * When you click a commit tab
 */
function click_specific_commit() {
  //hiding charts
  hideCharts(charts_all_commits);
  hideCharts(charts_specific_match);

  //showing charts
  showCharts(charts_specific_commit);

  //switch active tab
  activeTab("tab-specific-commit");
}

/**
 * When you click a match tab
 */
function click_specific_match() {
  //hiding charts
  hideCharts(charts_specific_commit);
  hideCharts(charts_all_commits);

  //TODO: show charts
  showCharts(charts_specific_match);

  //switch active tab
  activeTab("tab-specific-match");
  activeTab("content-specific-match");
}

/**
 * When you click an all tab
 */
function click_all_commits() {
  //hiding charts
  hideCharts(charts_specific_commit);
  hideCharts(charts_specific_match);

  //showing charts
  showCharts(charts_all_commits);

  //switch active tab
  activeTab("tab-all-commits");
  activeTab("content-all-commits");
}

/**
 *
 * @param {DivID} tabId
 */
function activeTab(tabId) {
  var arr = document.getElementsByClassName("nav-link");
  for (i = 0; i < arr.length; i++) {
    if (arr[i].id == tabId) {
      arr[i].classList.add("active");
    } else {
      // if(arr[i].classList.contains("active")) {
      arr[i].classList.remove("active");
    }
  }
}

function hideCharts(chartArray) {
  if (chartArray[0] == "") {
    //console.log("empty array");
    return;
  }
  var x;
  for (i = 0; i < chartArray.length; i++) {
    try {
      x = document.getElementById(chartArray[i]);
      x.parentElement.style.display = "none";
      x.classList.add("hidden");
    } catch (err) {
      console.log(
        "TAB-ERROR: #" + i + " Could not hide chart id = " + chartArray[i]
      );
    }
  }
}

function showCharts(chartArray) {
  if (chartArray[0] == "") {
    //console.log("empty array");
    return;
  }
  var x;
  for (i = 0; i < chartArray.length; i++) {
    try {
      x = document.getElementById(chartArray[i]);
      x.parentElement.style.display = "block";
      x.classList.remove("hidden");
    } catch (err) {
      console.log("TAB-ERROR: Could not show chart id = " + chartArray[i]);
    }
  }
}
