const jira = require('../src/jira/jira_api');

import axios from 'axios';

require('dotenv').config();

const domain = process.env.JIRA_DOMAIN;
const username = process.env.JIRA_USERNAME;
const accessToken = process.env.JIRA_API_TOKEN;
const fields = 'key,summary,status,updated'; 

jest.mock('axios');

describe('searchJira', () => {
    it('not null', async () => {

        const jql = 'project=tb'
        const url = `https://${domain}.atlassian.net/rest/api/3/search?jql=${encodeURIComponent(jql)}&fields=${encodeURIComponent(fields)}`;
        const res = await axios.get(url, {
            headers: {
                Authorization: `Basic ${Buffer.from(
                  `${username}:${accessToken}`
                ).toString('base64')}`,
                Accept: 'application/json',
              }
        });

        const result = await jira.searchJira(jql);
        //expect(axios.get).toHaveBeenCalled(url);
        expect(result).not.toBeNull();
    });

    it('get jiraDomain and jiraResults', async () => {

        const jql = 'project=tb'
        const url = `https://${domain}.atlassian.net/rest/api/3/search?jql=${encodeURIComponent(jql)}&fields=${encodeURIComponent(fields)}`;
        const res = await axios.get(url, {
            headers: {
                Authorization: `Basic ${Buffer.from(
                  `${username}:${accessToken}`
                ).toString('base64')}`,
                Accept: 'application/json',
              }
        });
        const mockData = {"jiraDomain": "https://capstone-tasks.atlassian.net", "jiraResult": []};
        axios.get.mockResolvedValue(mockData);

        const result = await jira.searchJira(jql);
        expect(result).toEqual(mockData);
                
    });

    it('project=tb and status="in progress"', async () => {

        const jql = 'project = TB AND issuetype = Task AND status = "In Progress"'
        const url = `https://${domain}.atlassian.net/rest/api/3/search?jql=${encodeURIComponent(jql)}&fields=${encodeURIComponent(fields)}`;
        const res = await axios.get(url, {
            headers: {
                Authorization: `Basic ${Buffer.from(
                  `${username}:${accessToken}`
                ).toString('base64')}`,
                Accept: 'application/json',
              }
        });
        const mockData = {"jiraDomain": "https://capstone-tasks.atlassian.net", "jiraResult": []};
        axios.get.mockResolvedValue(mockData.jiraResult);

        const result = await jira.searchJira(jql);
        expect(result).toEqual(mockData);
                
    });
});
