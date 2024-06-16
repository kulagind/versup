# Versup

Helps you to keep version of your application in tags

## Usage

### Preparations

Define env variable<br>
`REMOTE_WITH_TOKEN=<url>`<br>
where `<url>` is a string of url to your repo with access token (e.g. `https://<access-token-name>:<access-token>@gitlab.com/myuser/myrepo.git`)

Create config file `version.config.js` in your project root dir. Follow the example from this project.
Or create global variable<br>
`VER_CONFIG_PATH=<path>`<br>
where `<path>` is your path to config.js file relative to the project root dir.

### Docker

In progress

### NPM

1. Install it

```
npm install --save-dev versup
```

2. Add npx command to your pipeline

```
npx versup
```
