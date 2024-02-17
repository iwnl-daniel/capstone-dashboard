let InnerResponse = class {
    constructor(service, status, msg){
        this.service = service;
        this.status = status;
        this.msg = msg;
    }

    get info(){
        return {service : this.service, status: this.status, msg: this.msg};
    }
}

let userCreateResponse = class{
    constructor(serviceObj, userObj){
        this.serviceObj = serviceObj;
        this.userObj = userObj;
    }
    
    get info(){
        return {serviceStatus : this.serviceObj, userInfo : this.userObj};
    }
}

module.exports = { InnerResponse, userCreateResponse };
