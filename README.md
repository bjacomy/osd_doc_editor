# Doc Editor

> Doc Editor plugin for opensearchdashboards that edits documents (add, edit, delete, search, classification)

---

## Features

- add field to the index
  
- add document to the index
  
- edit document
  
- delete document
  
- search documents
  
- classify documents
  
## How to use Doc Editor

### add field to the index

![Alt Text](https://gitlab.si.francetelecom.fr/melvis/opensearchdashboards-plugins/doc-editor/raw/master/demo/add-field-video-plugin.gif)

### add document to the index

![Alt Text](https://gitlab.si.francetelecom.fr/melvis/opensearchdashboards-plugins/doc-editor/raw/master/demo/add-document-video-plugin.gif)

### edit and delete document

![Alt Text](https://gitlab.si.francetelecom.fr/melvis/opensearchdashboards-plugins/doc-editor/raw/master/demo/edit-delete-document-video-plugin.gif)

### search and classify documents

![Alt Text](https://gitlab.si.francetelecom.fr/melvis/opensearchdashboards-plugins/doc-editor/raw/master/demo/search-classify-document-video-plugin.gif)

## development

See the [opensearchdashboards contributing guide](https://github.com/elastic/opensearchdashboards/blob/master/CONTRIBUTING.md) for instructions setting up your development environment. Once you have completed that, use the following yarn scripts.

- `yarn osd bootstrap`

  Install dependencies and crosslink opensearchdashboards and all projects/plugins.

  > ***IMPORTANT:*** Use this script instead of `yarn` to install dependencies when switching branches, and re-run it whenever your dependencies change.

- Launch an opensearch instance

```bash
# in opensearchdashboards folder
yarn es snapshot --version 7.4.0 -E "xpack.security.enabled=false" -E http.cors.enabled=true" -E "http.cors.allow-origin=*" -E "http.cors.allow-methods=OPTIONS,HEAD,GET,POST,PUT,DELETE" -E "http.cors.allow-headers=X-Requested-With,X-Auth-Token,Content-Type,Content-Length,osd-version"

```

- `yarn start`

  Start opensearchdashboards and have it include this plugin. You can pass any arguments that you would normally send to `bin/opensearchdashboards`

    ```bash
    yarn start --opensearch.hosts http://localhost:9220
    ```

- `yarn build`

  Build a distributable archive of your plugin.

- `yarn test`

  Run jest test (you must have launch the snapshot of opensearch instance before).

- `yarn coverage`

  Run jest test with coverage (you must have launch the snapshot of opensearch instance before).

- `yarn test:browser`

  Run the browser tests in a real web browser.

- `yarn test:mocha`

  Run the server tests using mocha.

For more information about any of these commands run `yarn ${task} --help`. For a full list of tasks checkout the `package.json` file, or run `yarn run`.
