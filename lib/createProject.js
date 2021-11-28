const fs = require('fs');

class CreateProject {

    constructor() {}

    createProjectDirectory(projectName, cb) {
        fs.mkdir(process.cwd() + '/' + projectName, {recursive: true}, cb);
    }

    createProjectPackageJson(projectPath, projectName) {
        const content = `{
            "name": "${projectName}",
            "version": "1.0.0",
            "description": "A new CleaNode Project",
            "main": "app.js",
            "scripts": {
              "test": "jest",
              "dev": "NODE_ENV=development nodemon",
              "preprod": "NODE_ENV=preprod node app.js",
              "production": "npm i && NODE_ENV=production node app.js"
            },
            "author": "",
            "license": "ISC",
            "dependencies": {
              "bcryptjs": "^2.4.3",
              "body-parser": "^1.19.0",
              "compression": "^1.7.4",
              "cors": "^2.8.5",
              "express": "^4.17.1",
              "jsonwebtoken": "^8.5.1",
              "mongoose": "^5.10.2",
              "multer": "^1.4.2",
              "nodemailer": "^6.4.11",
              "passport": "^0.4.1",
              "passport-jwt": "^4.0.0",
              "simple-node-logger": "^18.12.24"
            },
            "devDependencies": {
              "@types/jest": "^26.0.13",
              "jest": "^26.4.2"
            }
          }`;
        return new Promise((resolve, reject) => {
            const writePackage = fs.createWriteStream(`${projectPath}/package.json`);

            writePackage.on('open', () => {
                resolve('package.json created');
            });

            writePackage.on('finish', () => {
                resolve('package.json created');
            });

            writePackage.on('error', err => {
                reject(err);
            });

            writePackage.write(content, err => {
                reject(err);
            });
            writePackage.end();
        });

    }

    createEnvDirectory(projectPath, projectName) {
        console.log('ENV DIRECTORY');
        return new Promise((resolve, reject) => {
            fs.mkdir(projectPath + '/env', {recursive: true}, (err, envPath) => {
                if (err) reject(err);
                console.log('ENV DIRECTORY 2 !!');
                const envIndexContent = `
                const devEnv = require('./env.dev');
                const prodEnv = require('./env.prod');
                const preprodEnv = require('./env.preprod');
                
                switch (process.env.NODE_ENV) {
                    case 'production':
                        module.exports = prodEnv;
                        break;
                    case 'preprod':
                        module.exports = preprodEnv;
                        break;
                    default:
                        module.exports = devEnv;
                        break;
                }`;

                const devContent = `
                module.exports = {
                  PORT: 3000,
                  DB_URL: 'mongodb://localhost:27017/',
                  DB_NAME: '${projectName}',
                  DB_USER: '',
                  DB_PASS: '',
                  LOGS_PATH: './logs',
                  CORS_WHITELIST: [],
                };`;

                const preprodConfig = {
                    PORT: 3000,
                    DB_URL: 'mongodb://',
                    DB_NAME: '${projectName}',
                    DB_USER: '',
                    DB_PASS: '',
                    LOGS_PATH: '/logs',
                    CORS_WHITELIST: [],
                }

                const preprodContent = `module.exports = ${JSON.stringify(preprodConfig, null, 4)};`;

                const prodContent = `
                module.exports = {
                  PORT: 3000,
                  DB_URL: 'mongodb://',
                  DB_NAME: '${projectName}',
                  DB_USER: '',
                  DB_PASS: '',
                  LOGS_PATH: '/logs',
                  CORS_WHITELIST: [],
                };`;

                const envIndex = fs.createWriteStream(`${envPath}/index.js`);
                const envDev = fs.createWriteStream(`${envPath}/env.dev.js`);
                const envPreprod = fs.createWriteStream(`${envPath}/env.preprod.js`);
                const envProd = fs.createWriteStream(`${envPath}/env.prod.js`);

                envIndex.on('finish', () => {
                    resolve('environment variables set');
                });

                envDev.write(devContent, err => {
                    if (err) reject(err);
                });

                envPreprod.write(preprodContent, err => {
                    if (err) reject(err);
                });

                envProd.write(prodContent, err => {
                    if (err) reject(err);
                });

                envIndex.write(envIndexContent, err => {
                    if (err) reject(err);
                });

                envDev.end();
                envPreprod.end();
                envProd.end();
                envIndex.end();

            });
        });
    }

}

module.exports = CreateProject;