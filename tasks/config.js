const pckg = require('../package.json');

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
        build: 'build',
        relrease: 'release',
        bot: `${config.paths.build}/gofbot`,
        packages: `${config.paths.bot}/packages`,
        app: 'app',
        src: `${config.paths.app}/src`
    },
    electron: {
        mac_packages: [`${config.paths.build}/**/*`, `!${config.paths.build}/pywin/**/*`, `!${config.paths.build}/pywin`],
        osx_packages: [`${config.paths.build}/**/*`]
    }
};

module.exports = config;