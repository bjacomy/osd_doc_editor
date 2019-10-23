import { resolve } from 'path'
import { resolveKibanaPath } from '@kbn/plugin-helpers'

import { MyServiceProvider } from './services/my_service'
import { MyAppPageProvider } from './services/my_app_page'

// the default export of config files must be a config provider
// that returns an object with the projects config values
export default async function ({ readConfigFile }) {

  // read the Kibana config file so that we can utilize some of
  // its services and PageObjects
  const kibanaConfig = await readConfigFile(resolveKibanaPath('test/functional/config.js'))

  return {
    // list paths to the files that contain your plugins tests
    testFiles: [
      resolve(__dirname, './my_test_file.js'),
    ],

    // define the name and providers for services that should be
    // available to your tests. If you don't specify anything here
    // only the built-in services will be available
    services: {
      ...kibanaConfig.get('services'),
      myService: MyServiceProvider,
    },

    // just like services, PageObjects are defined as a map of
    // names to Providers. Merge in Kibana's or pick specific ones
    pageObjects: {
      management: kibanaConfig.get('pageObjects.management'),
      myApp: MyAppPageProvider,
    },

    // the apps section defines the urls that
    // `PageObjects.common.navigateTo(appKey)` will use.
    // Merge urls for your plugin with the urls defined in
    // Kibana's config in order to use this helper
    apps: {
      ...kibanaConfig.get('apps'),
      myApp: {
        pathname: '/app/my_app',
      }
    },

    // choose where esArchiver should load archives from
    esArchiver: {
      directory: resolve(__dirname, './es_archives'),
    },

    // choose where screenshots should be saved
    screenshots: {
      directory: resolve(__dirname, './tmp/screenshots'),
    }

    // more settings, like timeouts, mochaOpts, etc are
    // defined in the config schema. See {blob}src/functional_test_runner/lib/config/schema.js[src/functional_test_runner/lib/config/schema.js]
  }
}

// From the root of your repo you should now be able to run the FunctionalTestRunner script from your plugin project.

// node ../../kibana/scripts/functional_test_runner