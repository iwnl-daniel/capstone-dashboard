const axios = require('axios');
const { sonarInterface } = require('../src/sonar/sonar_api.js'); 
const { sonarGetData } = require('../src/sonar/sonar_functions.js');

describe('Get sonar data from database', () => {
    test('Should return sonar data', async () => {
        const correctProjectLink = 'https://example-dashboard-container--7lq97hk.bravemoss-25f27461.westus3.azurecontainerapps.io/dashboard?id=example-dashbord_example-dashboard_AYaf6Zui92JIc1aL-XCb';
        const expected = [
            expect.objectContaining({
                projectLink: 'https://example-dashboard-container--7lq97hk.bravemoss-25f27461.westus3.azurecontainerapps.io/dashboard?id=example-dashbord_example-dashboard_AYaf6Zui92JIc1aL-XCb',
                projectConditions: expect.any(Array),
            }),
        ];
        const res = await sonarInterface(correctProjectLink);
        expect(res).toEqual(expected);
    })

})
