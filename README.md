# Webflow-IntenseDev-Template
Starter Code for projects of high-complexity that use Webflow, Vue and Firebase

## Installation

After cloning this repository, follow the following steps:

1. Replace all text occurrences of `project-xxx` with the name of your
   project (ex: **acme-corp-marketing-site**).
2. At the root of the repository, run `yarn` to install the base dependencies
3. Still at the root of the repository, run `yarn prepare` so Husky can be set up
4. Head over to the [Firebase Console](https://console.firebase.google.com/) and setup the Firebase
   project that will be used for this project. Note down the project information.
5. Update firebase-related information on all `firebase.json` files
6. Update the project dependencies according to your necessities.

## Front-end Installation and Deployment

1. Update the config object on `front-end/services/firebase` and any other place that might use firebase.
2. Update the dev output folder in the `webpack.config.js` file. Structure it like so: `local-{{project-name}}/{{project-domain}}/scripts`
3. Run `yarn deploy`

## Usage

1. For each new page, update the `webpack.config.js` file, with new pages added under the object called pageEntries.
2. When ready to start developing, write your new code, run `yarn dev` and use the [Content Override](https://docs.microsoft.com/en-us/microsoft-edge/devtools-guide-chromium/javascript/overrides) feature of browsers to override the application scripts with code from your machine.
3. To see new changes on the page you're working at, keep the developer panel open on your browser and reload the page.
