const Promise = require('bluebird');
const request = require('superagent');

const VERSION_TO_ENDPOINT = {
  "17": "http://erlang17-diss-service-9ad11fb4.erlang-diss-stack.302dcfe4.svc.dockerapp.io:8017",
  "18": "http://erlang18-diss-service-3ef045ca.erlang-diss-stack.44aab943.svc.dockerapp.io:8018",
  "19": "http://erlang19-diss-service-2dcbe420.erlang-diss-stack.5747f7d7.svc.dockerapp.io:8019"
};

class Disassembler {

  constructor(newLogger) {
    this.logger = newLogger;
  }

  run(obj={code, version, done}) {
    let code, version, done;
    ({code, version, done} = obj);
    return this.disassemble({code, version})
    .then((obj) => {
      done(obj);
    })
    .catch((obj) => {
      done(obj);
    });
  }

  // disassembles the given source class file
  disassemble(obj={code: null, version: null}) {
    let code, version;
    ({code, version} = obj);
    const url = VERSION_TO_ENDPOINT[version];
    return new Promise( (resolve, reject) => {
      request
        .post(url)
        .type('form')
        .send({ code })
        .end(function(err, res){
          if (err) {
            this.logger.error(`Unable to contact ${url}`);
            reject(err);
          } else {
            if (res && res.text) {
              try {
                const result = JSON.parse(res.text);
                resolve(result.result);
              } catch(parseError) {
                this.logger.error(`Unable to parse ${parseError}`);
                reject(parseError);
              }
            } else {
              this.logger.error(`Response was not formatted correctly`);
              reject("Unknown error");
            }
          }
        });
    });
  }

}

module.exports = Disassembler;
