const pckg = require('../package.json');


const buildPath =  'build';
const releasePath =  'release';
const botPath = `${buildPath}/gofbot`;

const config = {
    name: pckg.name,
    version: pckg.version,
    company: pckg.author,
    gofbot_ignore: {
        folders: [],
        files: ['ws_server.py', 'run.sh', 'setup.sh', 'README.md', 'pylint-recursive.py', 'Procfile', 'LICENSE',
    'json-validate.py', 'Dockerfile', 'CONTRIBUTORS.md', 'docker-compose.yml', 'docker-compose_tor.yml', '.travis.yml',
    '.styles.yapf', '.pylintrc', '.mention-bot', '.pullapprove.yml', '.dockerignore', '.gitignore']
    },
    paths: {
        build: buildPath,
        release: releasePath,
        bot: botPath,
        packages: `${botPath}/packages`,
        src: 'app/src'
    },
    electron: {
        mac_packages: [`${buildPath}/**/*`, `!${buildPath}/pywin/**/*`, `!${buildPath}/pywin`],
        win_packages: [`${buildPath}/**/*`]
    }
};

module.exports = config;
