import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {SupplierListHeader} from './components/header/SupplierListHeader'
import {SupplierTable} from './table/SupplierTable'
import {SupplierEditModal} from './user-edit-modal/SupplierEditModal'
import {KTCard} from '../../../../../_metronic/helpers'

const SupplierList = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <KTCard>
        <SupplierListHeader />
        <SupplierTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <SupplierEditModal />}
    </>
  )
}

const SupplierListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <SupplierList />
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {SupplierListWrapper}
