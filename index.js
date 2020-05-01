const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios')

try {
  const appPath = core.getInput('app-path');
  const url = "https://api-cloud.browserstack.com/app-automate/upload";
  console.log(`appPath -  ${appPath}!`);
  const bsUserName = core.getInput('browserstack-username');
  const bsAccessKey = core.getInput('browserstack-accesskey');
  const customId = core.getInput('custom-id');
  const form_data = new FormData();
  form_data.append("file", fs.createReadStream(appPath));
  form_data.append("custom_id", customId)
  const request_config = {
    auth: {
        username: bsUserName,
        password: bsAccessKey
      },  
    headers: {
        "Content-Type": "multipart/form-data"
  },
  data: form_data
  };
  axios
  .post(url, form_data, request_config)
  .then((response) => {
    console.log(response);
    core.setOutput("browserstack-app-url", response.data.app_url);
  }, (error) => {
    core.setFailed(error.message);
  });
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}