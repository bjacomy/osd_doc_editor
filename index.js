
import { i18n } from '@kbn/i18n'

import serverRoute from './server/routes/doc_editor_routes'

export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'doc-editor',
    uiExports: {
      app: {
        title: 'Doc Editor',
        description: 'Easily edit documents inside your elasticsearch indices',
        main: 'plugins/doc-editor/app',
        euiIconType: 'documentEdit'
      }
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default()
    },

    init(server, options) { // eslint-disable-line no-unused-vars
        const xpackMainPlugin = server.plugins.xpack_main
        if (xpackMainPlugin) {
          const featureId = 'doc-editor'

          xpackMainPlugin.registerFeature({
            id: featureId,
            name: i18n.translate('docEditor.featureRegistry.featureName', {
              defaultMessage: 'doc-editor',
            }),
            navLinkId: featureId,
            icon: 'questionInCircle',
            app: [featureId, 'kibana'],
            catalogue: [],
            privileges: {
              all: {
                api: [],
                savedObject: {
                  all: [],
                  read: [],
                },
                ui: ['show'],
              },
              read: {
                api: [],
                savedObject: {
                  all: [],
                  read: [],
                },
                ui: ['show'],
              },
            },
          })
        }

      // Add server routes and initialize the plugin here
      const adminCluster = server.plugins.elasticsearch.getCluster('admin')
      const dataCluster = server.plugins.elasticsearch.getCluster('data')
      serverRoute(server, adminCluster, dataCluster)
    }
  })
}