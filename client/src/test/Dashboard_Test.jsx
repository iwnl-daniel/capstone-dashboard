import React, { useEffect, useState } from 'react';
import '../App.css';
import GitlabWidget from '../widgets/gitlabWidget.jsx';
import useFetch from '../customhooks/useFetch.jsx';
/*
This component is for testing call from frontend to backend.
Not use
*/

export const Dashboard = () => {
  //These is a draft information that we will have in the user model
  const [user, setUser] = useState({
    //Get from SSO
    userEmail: 'man@mail.com',
    userSelectedProject: 'project1',
  });
  const [data, setData] = useState(null);
  const [gitlabData, setgitlabData] = useState({});
  const [sonarData, setSonarData] = useState({});
  const [jiraData, setJiraData] = useState({});
  const [ddata] = useFetch(
    `http://127.0.0.1:3001/user/interface/project?userEmail=${user.userEmail}&projectName=${user.userSelectedProject}`
  );
  useEffect(() => {
    async function fecthUserData() {
      try {
        //Local Access
        const res = await fetch(
          `http://127.0.0.1:3001/user/interface/project?userEmail=${user.userEmail}&projectName=${user.userSelectedProject}`
        );
        const data = await res.json();
        console.log(data['gitlabInfo']);
        setgitlabData(data['gitlabInfo']);
        console.log(data['sonarInfo']);
        setSonarData(data['sonarInfo']);
        console.log(data['jiraInfo']);
        setJiraData(data['jiraInfo']);
        setData(data['gitlabInfo']);
      } catch (error) {
        console.log(error);
      }
    }
    fecthUserData();
  }, []);
  console.log('get ', gitlabData);
  console.log('data ', ddata);
  return (
    <div>
      <h1>Dashboard</h1>
      <h2>{user.userSelectedProject}</h2>
      <h3 style={{ textAlign: 'left' }}>Gitlab</h3>
      <table>
        <thead>
          <tr>
            <th>Project ID</th>
            <th>Branch Name</th>
            <th>Pipeline 1</th>
            <th>Pipeline 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{gitlabData.projectId}</td>
            <td>{gitlabData.branchName}</td>
            {gitlabData.pipelines &&
              gitlabData.pipelines.map((status, idx) => (
                <td key={idx}>{status.pipelineStatus}</td>
              ))}
          </tr>
        </tbody>
      </table>
      <h3 style={{ textAlign: 'left' }}>Sonar</h3>
      <table>
        <thead>
          <tr>
            <th>Project Link</th>
            <th>Metric Keys</th>
            <th>Metric Status</th>
          </tr>
        </thead>
        <tbody>
          {sonarData.projectConditions &&
            sonarData.projectConditions.map(
              (condition, idx) => (
                <tr key={idx}>
                  <td>
                    {' '}
                    <a href={sonarData.projectLink}>
                      Project Link
                    </a>
                  </td>
                  <td>{condition.metricKey}</td>
                  <td>{condition.metricStatus}</td>
                </tr>
              )
            )}
        </tbody>
      </table>
      <h3 style={{ textAlign: 'left' }}>Jira</h3>
      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Summary</th>
            <th>Status</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          <td>{jiraData.Key}</td>
          <td>{jiraData.Summary}</td>
          <td>{jiraData.Status}</td>
          <td>{jiraData.Updated}</td>
        </tbody>
      </table>
      {data && (
        <GitlabWidget
          branchName={data.branchName}
          pipeline={data.pipelines}
          projectName={data.projectId}
        />
      )}
    </div>
  );
};
