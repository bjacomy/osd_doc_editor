import { i18n } from '@kbn/i18n';
import { AppMountParameters, CoreSetup, CoreStart, Plugin } from '../../../src/core/public';
import { DocEditorPluginSetup, DocEditorPluginStart, AppPluginStartDependencies } from './types';
import { PLUGIN_NAME } from '../common';

export class DocEditorPlugin implements Plugin<DocEditorPluginSetup, DocEditorPluginStart> {
  public setup(core: CoreSetup): DocEditorPluginSetup {
    // Register an application into the side navigation menu
    core.application.register({
      id: 'docEditor',
      title: PLUGIN_NAME,
      euiIconType: 'documentEdit',
      async mount(params: AppMountParameters) {
        // Load application bundle
        const { renderApp } = await import('./application');
        // Get start services as specified in kibana.json
        const [coreStart, depsStart] = await core.getStartServices();
        // Render the application
        return renderApp(coreStart, depsStart as AppPluginStartDependencies, params);
      },
    });

    // Return methods that should be available to other plugins
    return {
      getGreeting() {
        return i18n.translate('docEditor.greetingText', {
          defaultMessage: 'Hello from {name}!',
          values: {
            name: PLUGIN_NAME,
          },
        });
      },
    };
  }

  public start(core: CoreStart): DocEditorPluginStart {
    return {};
  }

  public stop() {}
}
