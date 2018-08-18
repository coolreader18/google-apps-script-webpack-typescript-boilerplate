# Google Apps Script Webpack Typescript Boilerplate
#### That's a mouthful, huh?

This is a boilerplate for using TypeScript in Google Apps Script. Pretty self explanatory.

## Downloading
In a shell with git, run
```sh
PROJECT_NAME=put-dir-here
# then
git clone https://github.com/coolreader18/google-apps-script-webpack-typescript-boilerplate $PROJECT_NAME --depth 1
cd $PROJECT_NAME
rm -rf .git
git init
yarn
```
Or, if you don't have git installed download the zip from github.

## Configuring
All that's needed to get up and running with pushing to GAS is to put your script ID into the [.env](.env) file and sign into
Clasp ([repo](https://github.com/google/clasp)).

## License
This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more details.
