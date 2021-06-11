import { schema, TypeOf } from '@kbn/config-schema';
import type { PluginConfigDescriptor } from 'kibana/server';
import {  PluginInitializerContext } from '../../../src/core/server';
import { DocEditorPlugin } from './plugin';

//  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.

const configSchema = schema.object({
  enabled: schema.boolean({ defaultValue: true })
});

export const config: PluginConfigDescriptor<ConfigType> = {
  exposeToBrowser: {
    enabled: true
  },
  schema: configSchema,
};
export   type ConfigType = TypeOf<typeof configSchema>;
export function plugin(initializerContext: PluginInitializerContext) {
  return new DocEditorPlugin(initializerContext);
}

export { DocEditorPluginSetup, DocEditorPluginStart } from './types';
