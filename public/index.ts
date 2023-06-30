import { PluginInitializerContext } from 'src/core/public/plugins';
import { DocEditorPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, opensearch_dashboards Platform `plugin()` initializer.
export function plugin(initializerContext: PluginInitializerContext) {
  return new DocEditorPlugin(initializerContext);
}
export { DocEditorPluginSetup, DocEditorPluginStart } from './types';
