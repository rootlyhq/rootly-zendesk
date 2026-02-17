# Rootly Zendesk App

## Getting Started

### Dependencies
- [Node.js](https://nodejs.org/en/) >= 24.0.0
- [Yarn](https://yarnpkg.com/) 4.x
- [Zendesk CLI](https://github.com/zendesk/zcli) (for local development and deployment)

If you use [mise](https://mise.jdx.dev/), versions are pinned in `mise.toml`.

### Setup
1. Clone or fork this repo
2. Run `yarn install`

### Running locally

To serve the app to your Zendesk instance with `?zcli_apps=true`, open a new terminal and run

```
yarn run watch
```
and then open a new terminal and run
```
zcli apps:server dist
```

## Folder structure

| Name                                    | Description                                                                                  |
|:----------------------------------------|:---------------------------------------------------------------------------------------------|
| [`dist/`](#dist)                        | The folder in which webpack packages the built version of your app                           |
| [`spec/`](#spec)                        | The folder in which all of your test files live                                              |
| [`src/`](#src)                          | The folder in which all of your source JavaScript, CSS, templates and translation files live |
| [`webpack/`](#webpack)                  | translations-loader and translations-plugin to support i18n in the application               |

#### dist
The dist directory is created when you run the app building scripts. You will need to package this folder when submitting your app to the Zendesk Apps Marketplace. It is also the folder you will have to serve when using [ZCLI](https://developer.zendesk.com/documentation/apps/app-developer-guide/zcli/). It includes your app's manifest.json file, an assets folder with all your compiled JavaScript and CSS as well as HTML and images.

#### spec
The spec directory is where all your tests and test helpers live.

#### src
The src directory is where your raw source code lives. It includes directories for JavaScript, stylesheets, templates, images and translations.

#### webpack
This directory contains custom tooling to process translations at build time:

- translations-loader.js converts .json translation files to JavaScript objects for the app.
- translations-plugin.js extracts compulsory translation strings from en.json for Zendesk Apps Marketplace metadata.

## I18n
The I18n module in `/src/javascripts/lib/i18n.js` provides a `t` method to look up translations based on a key. For more information, see [Using the I18n module](https://github.com/zendesk/app_scaffolds/blob/master/packages/react/doc/i18n.md).

## Parameters and Settings
If you need to test your app with a `parameters` section in `dist/manifest.json`, create a `settings.yml` file in the root directory and populate it with your parameter names and test values. For example:

```yaml
apiKey: 'your-rootly-api-key'
apiUrl: 'https://api.rootly.com/v1'
```

## Testing

Tests use [Jest](https://jestjs.io/) with jsdom. To run specs:

```
yarn test
```

Specs live under the `spec` directory.

## Deploying

To check that your app will pass the server-side validation check, run

```
zcli apps:validate dist
```

If validation is successful, you can upload the app into your Zendesk account by running

```
zcli apps:create dist
```

To update your app after it has been created in your account, run

```
zcli apps:update dist
```

Or, to create a zip archive for manual upload, run

```
zcli apps:package dist
```

For more information on the Zendesk CLI please see the [documentation](https://developer.zendesk.com/documentation/apps/app-developer-guide/zcli/).

## Useful Links
- https://developer.zendesk.com/
- https://developer.zendesk.com/documentation/apps/build-an-app/using-react-in-a-support-app/
