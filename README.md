# Webflow-IntenseDev-Template
Starter Code for Webflow-Vue-TypeScript projects powered by Webpack

## Installation
1. After cloning this repository, update the name of the project in the `package.json` file.
2. Setup the Firebase project that will be used for hosting, and note down the project url. 
4. Run `firebase deploy` from the CLI
3. Update the dev output folder in the `webpack.config.dev.js` file. Structure it like so: `local-{{project-name}}/{{project-domain}}/scripts`
4. Update the project dependencies according to your necessities.

## Usage
1. For each new page, update the file `config/webpackBase.js`, with new pages added under the object called pageEntries.
2. When ready to start developping, write your new code, run `yarn dev` and use the [Content Override](https://docs.microsoft.com/en-us/microsoft-edge/devtools-guide-chromium/javascript/overrides) feature of browsers to override the application scripts with code from your machine.
3. To see new changes on the page you're working at, keep the developer panel open on your browser and reload the page.
