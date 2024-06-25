import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {ProductListHeader} from './components/header/ProductListHeader'
import {ProductTable} from './table/ProductTable'
import {ProductEditModal} from './client-edit-modal/ProductEditModal'
import {KTCard} from '../../../../../_metronic/helpers'

const ClientsList = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <KTCard>
        <ProductListHeader />
        <ProductTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <ProductEditModal />}
    </>
  )
}

const ProductListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <ClientsList />
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {ProductListWrapper}
