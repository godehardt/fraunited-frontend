/**
 * This File is our Config for the Dashboard where we store all data which is used accros multiple Files.
 *
 * If you add more Configurable things add them here.
 *
 * @author Nils Jorek, Anton Beck, Gianni Pasqual
 */

 /**
  * GLOBAL_CONFIG, reachable from everywhere
  */
const GLOBAL_CONFIG = {
  metadata_url:
    build => `https://jenkins.informatik.fb2.hs-intern.de/job/RoboCup/${build}/api/json`,
  metadata_user: "rcadmin:11a325b5fbcb784c7094dc428b330d3f57",
  commit_url: "https://jenkins.informatik.fb2.hs-intern.de/robocup/commit/",
  match_url: "https://jenkins.informatik.fb2.hs-intern.de/robocup/match/",
  commit_id: "1354ef85760bd559aff07265910987c8b1bd3be5",
  commit_changelog_url:
    "https://gitlab.informatik.fb2.hs-intern.de/godehardt/robocup-ci/-/commit/",
  specificCommitPrefix: "specificCommit",
  charts: [
    "horizontalbarchart",
    "barchart",
    "comparisonchart",
    "boxplotchart",
    "radarchart",
    "piechart",
    "histogramchart",
    "heatmapchart",
    "linechart",
    "all_linechart",
    "all_comparisonchart",
    "match_barchart",
    "match_horizontalbarchart",
    "match_comparisonchart",
    "match_matchprogression",
  ],
  modules: ["metadata", "commit_selector", "match_selector"],
  html_path: "./html/",
  html_path_to_charts: "./html/charts/",
  html_path_to_modules: "./html/modules/",
  // Add "goal_differences" later and change properties to JSON not Array !
  properties: [
    "goals",
    "ball_on_side",
    "offsides",
    "total_shots",
    "yellow_cards",
    "shots_on_target",
    "total_shots",
    "passes",
    "possession",
    "red_cards",
    "free_kicks",
    "tackles",
    "pass_chains",
  ],
  values: ["max", "min", "mean", "avg"],
  bins: [60, 6, 120, 240],
  date_options: {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  },
  match_id: 1,
  logplayer_url: "https://jenkins.informatik.fb2.hs-intern.de/robocup/logplayer/index.html?url="
};

/**
 * layout: all elements in the layout collection can be passed straight to plotly
 * config: all elements in the config collection can be passed straight to plotly
 * color: the elements must be passed to the right parameters if needed
 * data: the elements must be passed to the right parameters if needed
 */
const PLOTLY_CONFIG = {
  data: {
    line_width: 1,
  },
  layout: {
    plot_bgcolor: "#ffffff",
    paper_bgcolor: "#ffffff" /*"#d0d6e2"*/,
    polar: { bgcolor: "#ffffff" },
  },
  config: {
    responsive: true,
    displaylogo: false,
  },
  color: {
    fra_uas: "#2b89cc",
    opponent: "#fd7e14",
    neutral: "#efeeee",
    win: "#3d940d",
    lose: "#cb081e",
    tie: "#3c3c3c"
  },
};
