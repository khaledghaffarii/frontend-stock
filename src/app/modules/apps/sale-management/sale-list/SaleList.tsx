import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {SaleListHeader} from './components/header/SaleListHeader'

import {SaleEditModal} from './client-edit-modal/SaleEditModal'
import {KTCard} from '../../../../../_metronic/helpers'
import {SaleTable} from './table/SaleTable'

const SaleList = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <KTCard>
        <SaleListHeader />
        <SaleTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <SaleEditModal />}
    </>
  )
}

const SaleListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <SaleList />
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {SaleListWrapper}
