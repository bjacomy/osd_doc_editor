/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { useState, useEffect } from 'react';
import { I18nProvider } from '@kbn/i18n/react';
import { BrowserRouter as Router } from 'react-router-dom';

import {
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiText,
} from '@elastic/eui';

import { CoreStart } from '../../../../src/core/public';
import { NavigationPublicPluginStart } from '../../../../src/plugins/navigation/public';

interface DocEditorAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
}

import IndexDetails from './IndexDetails'
import IndexList from './IndexList'

export const DocEditorApp = ({ basename, http }: DocEditorAppDeps) => {
  // Use React hooks to manage state.
  const [ atHome, setAtHome ] = useState<boolean>(true)
  const [ indices, setIndices ] = useState<string[]>([])
  const [ index, setIndex ] = useState<string | object>({})
  const [ toggleRefresh, setToggleRefresh ] = useState<boolean>(false)
  const [ isLoading, setIsLoading ] = useState<boolean>(false)

  const handleOnClickNextButton = (index: Object, cols: string) => {
    setAtHome(false)
    setIndex({name: index, selectedColumns: cols.split(',')})
  }

  const handleOnclickHome = () => {
    setAtHome(true)
    setToggleRefresh(!toggleRefresh)
  }

  useEffect(() => {
    const getIndices = async () => {
      setIsLoading(true)
      const result = await http.get('../api/doc-editor/indices')
      setIndices(result.data)
      setIsLoading(false)
    }
    getIndices()

    console.log('useEffect toggleRefresh: ', toggleRefresh)
  }, [toggleRefresh])

  // Render the application DOM.
  return (
    <Router basename={basename}>
      <I18nProvider>
        <>
          <EuiPage restrictWidth="1000px">
            <EuiPageBody>
              <EuiPageContent>
                <EuiPageContentBody>
                  <EuiText>
                    { atHome ?
                        isLoading ? (
                        <div>Loading ...</div>
                        ) : (
                          <IndexList indices={indices} column={[]} onClickNextButton={handleOnClickNextButton} />
                        ) :
                        <IndexDetails index={index.name} onClickHome={handleOnclickHome} selectedColumns={index.selectedColumns}/>
                    }
                  </EuiText>
                </EuiPageContentBody>
              </EuiPageContent>
            </EuiPageBody>
          </EuiPage>
        </>
      </I18nProvider>
    </Router>
  );
};
