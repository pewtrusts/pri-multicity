# The State of 10 Cities

Live site: [https://www.pewtrusts.org/en/research-and-analysis/data-visualizations/2019/the-state-of-10-cities](https://www.pewtrusts.org/en/research-and-analysis/data-visualizations/2019/the-state-of-10-cities)

## How to update the interactive

This interactive is not prerendered, so hotfixing the data files directly on Sitecore will result in the same update to the live page as a ful rebuild would. It's still best, though, best to make changes locally (see Local Development, below) and rebuild the production files. That method will allow you to preview the changes in local and stage environments before altering the live page.   Start the development server and then:

1. Replace the data in `src/data/dashboard-data.csv` with the new data provided by program staff. The column headers must match the existing files' exactly.

1. Any metadata changes such as number formats, order of the sections, and sources notes must be made in `src/data/dictionary.json`.

1. Textual changes can be made in `index-dev.html` for preview purposes, but the production output will include only the interactive itself. Textual changes for the live site must be made in the Rich Text fields in Sitecore.

Confirm the local output looks correct, then produce the preview page and then the production output (both explained below).

It is possible to hotfix the data by replacing the CSV directly in the relevant media library directory. On page load, the prerendered HTML will be patched to match the new data rather than the data with which the page was built. The full method is better so that the HTML matches the data on load and in case JavaScript fails.

## Build preview output
To build the preview page at [https://pewtrusts.github.io/pri-multicity/](https://pewtrusts.github.io/pri-multicity/), merge changes into the `preview` branch and push it to GitHub. GitHub Actions will automatically build and publish the page.

Program and Comms can review that page. When all is good, build the production output and update Sitecore.

## Build production output
Run `npm run build` to emit production files to the `dist/` folder. The contents of `dist/index.html` will need to be pasted into the third party embed of the page. All files in `dist/` will need to be uploaded to the Sitecore media library directory specified in `webpack.config.js`. (At the time of writing, `/~/media/data-visualizations/interactives/2019/multicity/updateNov2020/'`). 

## Local development

The application is bundled with Webpack v4. That and other development dependencies will have to be installed following the process outlined below. The initial development was performed with Node version 12; it's recommended that your environment matches. That can be accomplished easily with Node Version Manager.

### How to start local services
1. Use Node version 12.x.x
1. Install package dependencies
1. Start development server

Each step is explained in more detail below

#### Use Node version 12.x.x
The project's dependencies are compatible with Node version 12.x.x. Using a newer or older version will likely result in errors and dependency mismatches that will be hard to reconcile. The easiest way to manage Node versions is with Node Version Manager.

1. Install [Node Version Manager](https://github.com/nvm-sh/nvm#installing-and-updating)
2. In the root directory of this repo, run `nvm use`. The version manager will install the version of Node specified in this repo's .nvmrc file if it is not already installed and switch to that version.

#### Install package dependencies
The third-party code on which this application depends can be installed with Node Package Manager (npm). npm should have been installed when you installed Node via nvm. If not, consult [the npm docs](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#using-a-node-version-manager-to-install-node-js-and-npm).

1. In the root directory of this repo, run `npm install`.

#### Start the development server
Run `npm run dev` to run webpack and serve the app through its dev server. Point your browser to localhost:8080 or "Launch Chrome against localhost" via VS Code's Run and Debug menu.