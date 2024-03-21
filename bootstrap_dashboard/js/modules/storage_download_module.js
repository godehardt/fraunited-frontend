/**
 * This File is for the Metadata Download Buttons inside the Metadata Card
 * 
 * @author Nils Jorek
 */

/**
 * Will Download the Object as JSON Specified
 * @param {JSON} object, will be downloaded 
 * @param {String} title, name of object + unique ID
 */
function downloadFromLocalStorage(object, title) {
    let filename = `${title}.json`;
    let contentType = "application/json;charset=utf-8;";
    console.log(object);
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      var blob = new Blob([JSON.stringify(object)], { type: 'application/json' });
      navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      var a = document.createElement('a');
      a.download = filename;
      a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(object));
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
}
