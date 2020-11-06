import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger
} from '../../../src/core/server';

import { DocEditorPluginSetup, DocEditorPluginStart } from './types';
import { defineRoutes } from './routes';

export class DocEditorPlugin implements Plugin<DocEditorPluginSetup, DocEditorPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }
  public setup(core: CoreSetup) {
    this.logger.debug('doc-editor: Setup');
    const router = core.http.createRouter();

    // Register server side APIs
    defineRoutes(router);

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('doc-editor: Started');
    return {};
  }

  public stop() {}
}
