const CreateProject = require('./createProject');
const { exec } = require('child_process');
const os = require('os');


function saySomething(something) {

    if (something[2] === 'new') {
        const projectName = something[3];
        
        if (!projectName || projectName === '') {
            return console.error(new Error('New project must have a name'));
        }

        const createProject = new CreateProject();

        console.log(`Creating new CleaNode project with name '${projectName}'`);
        createProject.createProjectDirectory(projectName, (err, projectPath) => {
            if (err) {
                return console.error(err);
            }

            createProject.createProjectPackageJson(projectPath, projectName)
            .then(response => {
                console.log(response);
                console.log('Installing dependencies');
                exec(`npm install --prefix ${projectPath}`, (error, stdout, stderr) => {
                    if (error) {
                        return console.log(`error: ${error.message}`);
                    }
                    // if (stderr) {
                    //     return console.error(`STDERR: ${stderr}`);
                    // }
                    console.log(`stdout: ${stdout}`);
                    createProject.createEnvDirectory(projectPath, projectName)
                    .then((envResponse) => {
                        console.log(envResponse);
                        return console.log(`New CleaNode project created at '${response}'`);
                    }).catch((error) => {
                        console.error('Hey error:', error);
                    });
                });
            }).catch(error => {
                console.error('Hello error:', error);
            });            
        });

    }

    console.log(os.arch());

}

exports.saySomething = saySomething;