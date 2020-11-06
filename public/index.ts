import { DocEditorPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, Kibana Platform `plugin()` initializer.
export function plugin() {
  return new DocEditorPlugin();
}
export { DocEditorPluginSetup, DocEditorPluginStart } from './types';
