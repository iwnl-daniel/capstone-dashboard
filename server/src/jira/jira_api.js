require('dotenv').config({ path: '../.env' });
const axios = require('axios');

/** 
  * This function searches Jira for issues matching the given JQL query.
  * @description This function searches Jira for issues matching the given JQL query.
  * @param {string} jql The JQL query to search for.
  * @param {string} domain The domain of the Jira instance.
  * @param {string} username The username of the Jira account.
  * @param {string} accessToken The access token of the Jira account.
  * @param {string} fields The fields to return in the response.
  * @param {string} url The url to send the request to.
  * @param {string} resArray The array of objects containing the key, summary, status, and updated date of each issue.
  * @param {string} res The response from the request.
  * @param {string} issue The issue object from the response.
  * @param {string} key The key of the issue.
  * @param {string} summary The summary of the issue.
  * @param {string} status The status of the issue.
  * @param {string} updated The updated date of the issue.
  * @returns {Array} An array of objects containing the key, summary, status, and updated date of each issue.
  * @throws {Error} If the response is not valid JSON.
*/

async function searchJira(jql) {
  const domain = process.env.JIRA_DOMAIN;
  const username = process.env.JIRA_USERNAME;
  const accessToken = process.env.JIRA_API_TOKEN;
  const userDomain = `https://${domain}.atlassian.net`;
  const fields = 'key,summary,status,updated'; // specify desired fields
  const url = `https://${domain}.atlassian.net/rest/api/3/search?jql=${encodeURIComponent(
    jql
  )}&fields=${encodeURIComponent(fields)}`;
  let resArray = [];

  try {
    const res = await axios.get(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${username}:${accessToken}`
        ).toString('base64')}`,
        Accept: 'application/json',
      },
    });

    if (res.data && res.data['issues']) {
      res.data['issues'].forEach((issue) => {
        const {
          key,
          fields: { summary, status, updated },
        } = issue;
        resArray.push({
          Key: key,
          Summary: summary,
          Status: status.name,
          Updated: updated,
        });
      });
    };
    return {"jiraDomain" : userDomain, "jiraResult" : resArray};
  } catch (err) {
    console.error(`Jira_LOG: ${err}`);
  }
}

module.exports = { searchJira };
