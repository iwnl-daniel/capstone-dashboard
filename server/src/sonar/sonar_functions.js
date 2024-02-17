const mongoose = require('mongoose');
require('dotenv').config()

//connect to mongo
try{
    mongoose.connect(`mongodb+srv://capstone:${process.env.MONGO_PASSWORD}@cluster0.9lkorgn.mongodb.net/?retryWrites=true&w=majority`,
    );
}catch(err){
    console.error("Can't connect to DB");
}

//Open the connection
const db = mongoose.connection;
db.once("open", () => {
    console.log("Sonar DB Connection is on");
});

//Create Collection
const projectSchema = new mongoose.Schema(
    {
        projectLink: String,
        projectConditions: Array
    }

)

const sonarSchema = mongoose.model('sonar', projectSchema);

/**
 * During the project creation, we will also update sonar information
 * to our database. 
 * The reason for this structure is we have a problem with getting response from sonar.
 * Many times will end up in 400, 401. 
 * @param {string} projectLink 
 * @param {string} projectSummary 
 * @returns {dictionary} sonar object
 */
const updateSonarData = async (projectLink, projectSummary) => {
    try{
        const isDuplicate = await isProjectLinkExist(projectLink);
        if(isDuplicate){
            console.log("Found Duplicate project link");
            return;
        }

        const conditions = projectSummary["projectStatus"]["conditions"];
        const conditionsDict = conditions.map(condition => ({
            metricKey: condition.metricKey,
            metricStatus: condition.status
        }));

        let res = {
            "projectLink" : projectLink,
            "projectConditions" : conditionsDict
        };
        const updateToDatabase = new sonarSchema(res);
        try{
            updateToDatabase.save();
            console.info("UPDATE TO SONAR DATABASE");
        }catch(err){
            console.error(`Cant' save data to database: ${err}`);
        }
    }catch(err){
        console.log(`Error happened at updateSonarData: ${err}`);
    }
}

/**
 * This function is to check if this project list is already exist
 * if exist, we will just update, else will create
 * @param {string} projectLink 
 * @returns {boolean} if found, then return true, else return false
 */
async function isProjectLinkExist(projectLink){
    try{
        const count = await sonarSchema.countDocuments({projectLink:projectLink});
        return count > 0;
    }catch(err){
        console.error(err)
    }
}

/**
 * This function is for get sonar information from the databse. 
 * @param {string} projectLink 
 */
const sonarGetdata = async(projectLink) => {
    try{
        const found = await sonarSchema.find({projectLink: projectLink});
        return found;
    }catch(err){
        console.error("Can't find this projec link");
    }
}

/**
 * When user give the sonar link - we expected to be a full link from the project page.
 * Then on the backend we will handle the the filter to get project link, and project key
 * @param {string} projectUrl 
 * @returns {dictionary} projectLink, and projectKey
 */

async function filterSonarUrl(projectUrl){
    try{
        let temp = projectUrl.split('/');
        let projectLink = `${temp[0]}//${temp[2]}`;
        let projectKey = projectUrl.split('=')[1];
        return {"projectLink" : projectLink, "projectKey": projectKey}
    }catch(err){
        console.error(`Can't isolate the projectLink and projectId from the userUrl: ${err}`);
    }
}

module.exports = {updateSonarData, sonarGetdata, filterSonarUrl}

