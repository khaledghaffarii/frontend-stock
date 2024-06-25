import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {CategoryListHeader} from './components/header/CategoryListHeader'

import {CategoryEditModal} from './client-edit-modal/CategoryEditModal'
import {KTCard} from '../../../../../_metronic/helpers'
import {CategoryTable} from './table/CategoryTable'

const CategoryList = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <KTCard>
        <CategoryListHeader />
        <CategoryTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <CategoryEditModal />}
    </>
  )
}

const CategoryListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <CategoryList />
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {CategoryListWrapper}
