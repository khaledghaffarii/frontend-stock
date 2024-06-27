import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {AchatListHeader} from './components/header/AchatListHeader'
import {AchatTable} from './table/AchatTable'
import {AchatEditModal} from './client-edit-modal/AchatEditModal'
import {KTCard} from '../../../../../_metronic/helpers'

const AchatList = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <KTCard>
        <AchatListHeader />
        <AchatTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <AchatEditModal />}
    </>
  )
}

const AchatListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <AchatList />
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {AchatListWrapper}
