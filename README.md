# Doc Editor

> Doc Editor plugin for Kibana that edits documents (add, edit, delete, search, classification)

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

![Alt Text](https://code.search.orangeportails.net/metriks/kibana-plugins/doc-editor/raw/master/demo/add-field-video-plugin.gif)

### add document to the index

![Alt Text](https://code.search.orangeportails.net/metriks/kibana-plugins/doc-editor/raw/master/demo/add-document-video-plugin.gif)

### edit and delete document

![Alt Text](https://code.search.orangeportails.net/metriks/kibana-plugins/doc-editor/raw/master/demo/edit-delete-document-video-plugin.gif)

### search and classify documents

![Alt Text](https://code.search.orangeportails.net/metriks/kibana-plugins/doc-editor/raw/master/demo/search-classify-document-video-plugin.gif)



## Development

See the [kibana contributing guide](https://github.com/elastic/kibana/blob/master/CONTRIBUTING.md) for instructions setting up your development environment. Once you have completed that, use the following npm tasks.

  - `npm start`

    Start kibana and have it include this plugin

  - `npm start -- --config kibana.yml`

    You can pass any argument that you would normally send to `bin/kibana` by putting them after `--` when running `npm start`

  - `npm run build`

    Build a distributable archive

  - `npm run test:browser`

    Run the browser tests in a real web browser

  - `npm run test:server`

    Run the server tests using mocha

For more information about any of these commands run `npm run ${task} -- --help`.
