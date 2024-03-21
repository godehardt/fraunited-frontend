function loadMetaData(data) {
  if (data) {
    let commitObject = localData.get(
      GLOBAL_CONFIG.specificCommitPrefix + GLOBAL_CONFIG.commit_id
    );
    let tableHeader = ["#", "Property", "Value"];
    let informationList = getInformationList(data, commitObject);
    let metadatadiv = $("#metaDataInfo");

    if (metadatadiv.children().length != 0) {
      metadatadiv.empty();
      $(".renderjson").remove();
    }
    createTable(metadatadiv, "infoTable", tableHeader);
    addRows("infoTableBody", informationList);

    $("#metaDataDownContainer").show();
    $("#colMeta").append(renderjson(data));
    $("#downloadMetadataBtn").on("click", () => {
      downloadFromLocalStorage(
        data,
        `Metadata_${commitObject.commitID}`
      );
    });

    $("#colCommit").append(renderjson(commitObject));
    $("#downloadCommitBtn").on("click", () => {
      downloadFromLocalStorage(
        commitObject,
        `Commitdata_${commitObject.commitID}`
      );
    });
  }
}

function createTable(area, tableID, headerValues) {
  area.append(
    `<table id='${tableID}' class='table table-hover-blue table-sm'>`
  );
  let tablediv = $(`#${tableID}`);

  tablediv.append(`<thead class="blue white-text"><tr id="${tableID}header">`);

  let headerdiv = $(`#${tableID}header`);
  headerValues.forEach((element) => {
    headerdiv.append(`<th scope="col">${element}</th>`);
  });

  tablediv.append(`<tbody id="${tableID}Body">`);
}

function addRows(tableID, values) {
  let i = 0;
  values[0].forEach((element) => {
    let newRow = document.getElementById(`${tableID}`).insertRow();
    let cellID = newRow.insertCell(0);
    cellID.appendChild(document.createTextNode(i));
    let j = 1;
    element.forEach((entry) => {
      //console.log(j);
      let cellEntry = newRow.insertCell(j);
      let text = document.createTextNode(`${element[j - 1]}`);
      cellEntry.classList.add("text-wrap");
      // At Postion for Commit ID add Changelog Hyperlink
      if (i == 2 && j == 2) {
        text = document.createElement("a");
        text.append(document.createTextNode(`${element[j - 1]}`));
        text.href = values[1];
        text.setAttribute("data-toggle", "tooltip");
        text.setAttribute("style", "color:#fd7e14;");
        text.setAttribute("data-placement", "right");
        text.setAttribute("title", "Click Link for Git ChangeLog");
      }
      cellEntry.appendChild(text);
      j++;
    });
    i++;
  });
}

function getInformationList(metadataObject, commitObject) {
  const commitId = commitObject.commitID;
  const item = metadataObject.changeSet.items.find(el => el.commitId === commitId);
  if (!item) throw `No Metadate could be found for ${commitId}`;

  let informationList = new Array();
  let changelogID =
    GLOBAL_CONFIG.commit_changelog_url +
    item.id;
  informationList.push(
    new Array(
      "github " + Object.keys(item)[4],
      (value = item.authorEmail)
    )
  );
  informationList.push(
    new Array(
      Object.keys(item)[6] +
        "(Jenkins)",
      new Date(
        item.date
      ).toLocaleString("de-DE")
    )
  );
  informationList.push(new Array("current cid", GLOBAL_CONFIG.commit_id));

  if (metadataObject.changeSet.items.length > 1) {
    informationList.push(new Array(`Number of commits`, metadataObject.changeSet.items.length));
    metadataObject.changeSet.items.forEach((el, index) => {
      informationList.push(new Array(`Commit ${index + 1}`, el.id));
    })
  }

  informationList.push(
    new Array(
      "commit " + Object.keys(item)[8],
      item.msg
    )
  );
  informationList.push(
    new Array(
      Object.keys(commitObject)[2].replace("Created", "(CommitData)"),
      new Date(commitObject.dateCreated).toLocaleString("de-DE")
    )
  );
  informationList.push(
    new Array(Object.keys(commitObject)[14], commitObject.nmatches)
  );
  informationList.push(
    new Array(Object.keys(commitObject)[16], commitObject.team_l)
  );
  informationList.push(
    new Array(Object.keys(commitObject)[31], commitObject.team_r)
  );

  return [informationList, changelogID];
}

async function loadMetaDataAllCommits() {
  let div = $("#content-all-commits");
  var db_object_name = "AllCommits";
  var data = {};

  if (localData.get(db_object_name) == null) {
    // If we do not have data in the database
    //console.log(`No data stored in local_storage for commit_id: ${commitId}`);
    data = await getAllCommitData(); // Receive the data for the specified CID, property and bin Size
    //console.log(`Data<${typeof data}> saved to local_storage.\nData:\n${data}`);
  } else {
    data = localData.get(db_object_name);
  } // The data is already inside our localStorage -> get it -> map it to data

  var sumMatches = 0;
  var sumWins = 0;
  var sumLosses = 0;

  for (var commit in data) {
    sumMatches += data[commit]["nmatches"];
    sumWins += data[commit]["wins"]["r"];
    sumLosses += data[commit]["wins"]["l"];
  }

  div.append(
    `<a>Matches: ${sumMatches} Wins: ${sumWins} Losses: ${sumLosses}</a>`
  );
}
