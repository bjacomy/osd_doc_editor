import { NavigationPublicPluginStart } from '../../../src/plugins/navigation/public';

export interface DocEditorPluginSetup {
  getGreeting: () => string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DocEditorPluginStart {}

export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
}
