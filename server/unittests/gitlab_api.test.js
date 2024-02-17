const git = require('../src/gitlab/gitlab_api');
 
import axios from 'axios';

require('dotenv').config();

const key = {
    headers: {'PRIVATE-TOKEN' : process.env.GITLAB_PRIVATE_TOKEN}
};

jest.mock('axios');

describe('gitGetProjectInfo', () => {
	it('returns the project info', async () => {
	  const projectId = 123;
	  const encodedProjectId = encodeURIComponent(projectId);
	  const url = `https://gitlab.com/api/v4/projects/${encodedProjectId}`;
	  const mockData = { id: projectId, name: 'Project A' };
	  axios.get.mockResolvedValue({ data: mockData });
  
	  const result = await git.gitGetProjectInfo(projectId);
  
	  expect(axios.get).toHaveBeenCalledWith(url, key);
	  expect(result).toEqual(mockData);
	});
  
	it('handles API error', async () => {
	  const projectId = 123;
	  const encodedProjectId = encodeURIComponent(projectId);
	  const url = `https://gitlab.com/api/v4/projects/${encodedProjectId}`;
	  const errorMessage = 'Project not found';
	  axios.get.mockRejectedValue({ message: errorMessage });
      console.error = jest.fn();
  
	  const result = await git.gitGetProjectInfo(projectId);
  
	  expect(axios.get).toHaveBeenCalledWith(url, key);
	  expect(result).toBeUndefined();
	  expect(console.error).toHaveBeenCalledWith('GITLAB_LOG: Project not found');
	});
  });

describe('gitGetPipelineStatus', () => {
    it('returns pipelineStatus', async() => {
	    const projectId = 123;
	    const encodedProjectId = encodeURIComponent(projectId);
        const url = `https://gitlab.com/api/v4/projects/${encodedProjectId}/pipelines`;
        const mockData = [{id: 1, status:'success'}, {id:2, status:'failed'}];
        axios.get.mockResolvedValue({data: mockData});

        const result = await git.gitGetPipelineStatus(projectId);
        expect(axios.get).toHaveBeenCalledWith(url, key);
        expect(result).toEqual(mockData);
    });

    it('handles API error', async() => {
	    const projectId = 123;
	    const encodedProjectId = encodeURIComponent(projectId);
        const url = `https://gitlab.com/api/v4/projects/${encodedProjectId}/pipelines`;
        const errorMsg = 'Project Not Found';
        axios.get.mockRejectedValue({message: errorMsg});
        console.error = jest.fn();
  
	    const result = await git.gitGetPipelineStatus(projectId);
  
	    expect(axios.get).toHaveBeenCalledWith(url, key);
	    expect(result).toBeUndefined();
	    expect(console.error).toHaveBeenCalledWith('GITLAB_LOG: Project not found');



    });
})
