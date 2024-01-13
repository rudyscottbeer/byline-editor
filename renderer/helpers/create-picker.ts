import { ipcRenderer } from 'electron';
import { clientid, redirectURI, scope, port, clientSecret, apiKey} from '../../main/helpers/config';



let pickerInited = false;


function pickerCallback(data) {
  if(data.action == google.picker.Action.PICKED) {
  let url = 'nothing';
  let doc;
  let docID;
  if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
    doc = data[google.picker.Response.DOCUMENTS][0];
    url = doc[google.picker.Document.URL];
    docID = doc[google.picker.Document.ID];
  }
  if(docID) {
    ipcRenderer.invoke('load-document', docID);
  } else {
    console.error("Failed to get Document ID.");
  }
}
}






export function createPicker(accessToken) {
    const view = new google.picker.View(google.picker.ViewId.DOCUMENTS);
    const picker = new google.picker.PickerBuilder()
        .enableFeature(google.picker.Feature.NAV_HIDDEN)
        .setDeveloperKey(apiKey)
        .setOAuthToken(accessToken)
        .addView(view)
        .setCallback(pickerCallback)
        .build();
    picker.setVisible(true);
  }




