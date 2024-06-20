import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {ClientsListHeader} from './components/header/ClientListHeader'
import {ClientTable} from './table/ClientTable'
import {UserEditModal} from './client-edit-modal/ClientEditModal'
import {KTCard} from '../../../../../_metronic/helpers'

const ClientsList = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <KTCard>
        <ClientsListHeader />
        <ClientTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <UserEditModal />}
    </>
  )
}

const ClientsListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <ClientsList />
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {ClientsListWrapper}
