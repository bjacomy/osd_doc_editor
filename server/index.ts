import { PluginInitializerContext } from '../../../src/core/server';
import { DocEditorPlugin } from './plugin';

//  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new DocEditorPlugin(initializerContext);
}

export { DocEditorPluginSetup, DocEditorPluginStart } from './types';
