/**
 * This File is to implement the Dropdown Menu on the Specific Commit Tab 
 *
 * @author Nils Jorek, Gianni Pasqual
 * @since  01.04.2020
 */


/**
 * Method uses the CORS Module to dynamically append new elements to the dropdown overview
 * 
 * @see GLOBAL_CONFIG.commit_id
 * @fires load_charts
 */
async function getCommits() {
  var dropdown = $("#commit-dropdown-menu");
  // even though it says await has no effect, it does!!!
  let commits = await getCommitHistory();
  if (dropdown.children().length != 0) {
    // div has no other tags inside it
    dropdown.html("");
  }
  console.table(commits);
  try {
    commits.reverse().forEach((element) => {
      let localCommitData = localData.get(GLOBAL_CONFIG.specificCommitPrefix + element);
      if(typeof localCommitData === "object" && localCommitData.dateCreated != null){
          var timestamp = localData.get(GLOBAL_CONFIG.specificCommitPrefix + element).dateCreated;
          var format = new Date(timestamp).toLocaleString('de-DE');
      }
      else{
        format = "No Date provided.";
      }
      dropdown.append(
        `<a class="dropdown-item" href="#" rel="tooltip" data-placement="right" title='Last Run Date: ${format}' onclick="setCurrentCommit('${element}');">${element}</a>`
      );
    });   
  } catch (error) {
    console.log("Dropdown: " + error);
  }
}
/**
 * Method is self explanatory
 * @param {String} cid, to set the global config cid for the preview page
 * @see GLOBAL_CONFIG.commit_id
 * @fires load_charts, getMetaData
 */
function setCurrentCommit(cid) {
  GLOBAL_CONFIG.commit_id = cid;
  loadCharts().then(() => {
    getMetaData();
  });
}
