import React, { Fragment, useState, useEffect } from 'react'

import IndexDetails from '../IndexDetails'
import IndexList from '../IndexList'

export const Main = (props) => {

  const { httpClient } = props

  const [ atHome, setAtHome ] = useState(true)
  const [ indices, setIndices ] = useState([])
  const [ index, setIndex ] = useState({})
  const [ toggleRefresh, setToggleRefresh ] = useState(false)
  const [ isLoading, setIsLoading ] = useState(false)

  const handleOnClickNextButton = (index, cols) => {
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
      const result = await httpClient.get('../api/doc-editor/indices')
      setIndices(result.data)
      setIsLoading(false)
    }
    getIndices()

    console.log('useEffect toggleRefresh: ', toggleRefresh)
  }, [toggleRefresh])

  return (
    <Fragment>
      { atHome ?
          isLoading ? (
          <div>Loading ...</div>
          ) : (
            <IndexList indices={indices} column={[]} onClickNextButton={handleOnClickNextButton} />
          ) :
          <IndexDetails index={index.name} onClickHome={handleOnclickHome} selectedColumns={index.selectedColumns}/>
      }
    </Fragment>
  )

}
