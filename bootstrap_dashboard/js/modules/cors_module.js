/**
 * This File is necessary to fetch all Data from the Robocup CI Server.
 *
 * If u write a method that fetches data which requires Cross Site access, write it here.
 *
 * @link   https://developer.mozilla.org/de/docs/Web/HTTP/CORS
 * @author Nils Jorek.
 * @since  01.04.2020
 */

/**
 * Method gets a Promise JSON for the provided URL
 *
 * @param {String} inputURL should be normal URL Format
 * @return {Promise} JSON, handle the promise
 */
async function getJSONfromURL(inputURL) {
  try {
    // awaits the response-body and parses it to json
    return (await fetch(inputURL)).json();
  } catch (error) {
    console.log(error);
    alert(`Failed to fetch Data for ${inputURL}`);
    throw error;
  }
}

/**
 * Method is used in match tab to get match data
 *
 * @param {int} matchid, integer > 0
 * @see GLOBAL_CONFIG.match_url
 * @return {Object} JSON, handle the promise accordingly
 */
async function getJSONforMatch(matchid) {
  try {
    return await getJSONfromURL(GLOBAL_CONFIG.match_url + matchid);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * Method is used in the Commit Dropdown Button
 *
 * @see getJSONfromURL(), GLOBAL_CONFIG.commit_url
 * @return {Array} the Object Commit History as an arry of strings
 */
async function getCommitHistory() {
  try {
    return await getJSONfromURL(GLOBAL_CONFIG.commit_url);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * Method is used for the Specific Commit Tab
 *
 * @param {String} commitId should be formatted as a github commitId
 * @see getJSONfromURL(), GLOBAL_CONFIG.commit_url
 * @return {Object} the Object as JSON
 */
async function getSpecificCommit(commitId) {
  try {
    return await getJSONfromURL(GLOBAL_CONFIG.commit_url + commitId);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * Method should provide the JSON Data for the Histogram Requests in Specific Commit
 *
 * @param {String} commitId -> a valid CommitId
 * @param {String} property -> a property which supports histogram data (goals)
 * @param {String} binSize -> defines the size of the return array
 * @see getJSONfromURL(), GLOBAL_CONFIG.commit_url
 * @return {Object} the Object as JSON
 */
async function getHistogramData(commitId, property, binSize) {
  var url_l = `${
    GLOBAL_CONFIG.commit_url + commitId
  }/histogram/${property}_l.${binSize}`;
  var url_r = `${
    GLOBAL_CONFIG.commit_url + commitId
  }/histogram/${property}_r.${binSize}`;
  // console.log("Request link left is: ", url_l);
  // console.log("Request link right is: ", url_r);
  try {
    var result = new Array();
    var obj_l = await getJSONfromURL(url_l);
    var obj_r = await getJSONfromURL(url_r);
    result.push(obj_l);
    result.push(obj_r);
    //Returning the final resolved Object
    // console.log("GETHISTDATA: " + result);
    return result;
  } catch (error) {
    console.log(e);
    throw error;
  }
}

/**
 * Finds the metadata for the currently selected commit
 * This is solved recursive as we have to check every build if it contains the correct commit
 *
 * @see loadMetadata(data)
 * @return {Object} the Object as JSON
 */
async function getMetaData(build = 'lastBuild') {
  const commitId = GLOBAL_CONFIG.commit_id;
  const cacheKey = `metadata/${commitId}`;
  if (!commitId) throw 'No commit id active';

  const cacheData = localData.get(cacheKey);
  if (cacheData) {
    loadMetaData(cacheData);
    return;
  }

  console.log(`Loading metadata for build ${build}`);
  $.ajax({
    url: GLOBAL_CONFIG.metadata_url(build),
    beforeSend: function (xhr) {
      xhr.setRequestHeader(
        "Authorization",
        "Basic " + btoa(GLOBAL_CONFIG.metadata_user)
      );
    },
    success: function (jsonMetaData) {
      const items = jsonMetaData.changeSet.items;
      if (
        !items.length ||
        !items.find(el => el.commitId === commitId)
      ) {
        const buildId = jsonMetaData.number;
        if (buildId < 0) throw `no build for ${commitId} could be found`;
        getMetaData(buildId - 1);
        return;
      }
      localData.set(cacheKey, jsonMetaData);
      loadMetaData(jsonMetaData);
    },
    error: function (xhr, textStatus, errorThrown) {
      console.log(xhr, textStatus, errorThrown);
    },
  });
}

/**
 * Method is used for the Charts inside the All Commits Tab
 *
 * @see getCommitHistory(), getSpecificCommit()
 * @return {JSON} returns a JSON with all the Commit JSONs fetched
 */
async function getAllCommitData() {
  let commitHistory = await getCommitHistory();
  //for each commit in reach
  const data = new Array();
  commitHistory.forEach((commit) => {
    //write back commit data to a json
    data.push(getSpecificCommit(commit));
  });
  let resolvedData = await Promise.all(data);

  const retJSON = {};
  commitHistory.map((value, index) => {
    const linkedJSON = resolvedData[index];
    retJSON[`${value}`] = linkedJSON;
  });
  //JSON of Form: {CID: CDATA, ...}
  if (localData.get("AllCommits") == null) {
    //console.log("AllCommitData needs to be stored");
    localData.set("AllCommits", retJSON);
  }
  return retJSON;
}
