const pckg = require('../package.json');

/**
 * Authors Note ~ Listen I know this prbably is not the best structure for a config but it looks pretty good to me and
 * it's the best I can do especially if I want the ability to combine paths. Sorry :T
 **/

const config = {
    get name() { return pckg.name },
    get version() { return pckg.version },
    get company() { return pckg.author },
    get main() { return 'electron.js'},
    get app() { return 'app.js'},
    gofbot_ignore: {
        get folders() { return ['docs', 'windows_bat', '.github', 'tests', 'web'] },
        get files() {
            return ['ws_server.py', 'run.sh', 'setup.sh', 'README.md', 'pylint-recursive.py', 'Procfile', 'LICENSE',
                'json-validate.py', 'Dockerfile', 'CONTRIBUTORS.md', 'docker-compose.yml', 'docker-compose_tor.yml',
                '.travis.yml', '.styles.yapf', '.pylintrc', '.mention-bot', '.pullapprove.yml', '.dockerignore',
                '.gitignore', '.gitmodules']
        }
    },
    paths: {
        get build() { return 'build' },
        get release() { return 'release'},
        get bot() { return `${config.paths.build}/gofbot`},
        get packages() { return `${config.paths.bot}/packages`},
        get app() { return 'app' },
        get src() { return `${config.paths.app}/src` }
    },
    electron: {
        get win_packages() { return [`${config.paths.build}/**/*`, `!${config.paths.build}/pywin/**/*`, `!${config.paths.build}/pywin`] },
        get osx_packages() { return [`${config.paths.build}/**/*`] }
    }
};

module.exports = config;