const core = require('@actions/core');
const github = require('@actions/github');

const axios = require('axios');

try {
  
// read the vars from action.yml
	const repoInfo = JSON.parse(core.getInput('repoInfo'));
	const names = JSON.parse(core.getInput('names'));

	const username = core.getInput('username');
	const icon = core.getInput('icon');
	const url = core.getInput('url');

	const authorName = ( names[repoInfo.username] ) ? names[repoInfo.username] : repoInfo.username;

	// create the json packet

	const message = {
		"username": username,
		"content": "\n",
		"embeds": [
			{
				// maybe add an option for this?
				"color": 1624533, 
				"timestamp": repoInfo.timestamp,
				"author": {
					"name": repoInfo.username,
					"url": icon,
					"icon_url": icon
				},
				"fields": [
					{
						"name": "Author",
						"value": authorName,
						"inline": true
					},
					{
						"name": "Branch",
						"value":  repoInfo.branch,
						"inline": true
					},
					{
						"name": repoInfo.title,
						"value": repoInfo.body || repoInfo.title
					}
				]
			}
		]
	}

	// send message using axios
	axios.post(url, message).then (function (response) {
		core.setOutput('response', response.data);
	}).catch(function (error) {
		console.log(error);
		core.setFailed(error.message);
	});
} catch (error) {
  core.setFailed(error.message);
}