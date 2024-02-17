const mongoose = require('mongoose');

//Clear mongoose cache if return doesn't updated
//Make sure to only use this when you encounter the cache problem in DEV's env
mongoose.models = {};
mongoose.modelSchemas = {};
mongoose.connection.models = {};
