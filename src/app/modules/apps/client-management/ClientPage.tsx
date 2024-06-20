import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {ClientsListWrapper} from './users-list/ClientList'
import {QUERIES, isNotEmpty} from '../../../../_metronic/helpers'
import {useQuery} from 'react-query'
import {useAuth} from '../../auth'
import {useListView} from './users-list/core/ListViewProvider'
import {getClientById} from './users-list/core/_requests'
import {useIntl} from 'react-intl'
import ClientView from './ClientView'

const clientsBreadcrumbs: Array<PageLink> = [
  {
    title: 'Client Management',
    path: '/apps/client-management/clients',
    isSeparator: false,
    isActive: false,
  },
  {
    title: 'Client View',
    path: '/apps/client-management/clients/view',
    isSeparator: true,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const ClientPage = () => {
  const {itemIdForUpdate, setItemIdForUpdate} = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)
  const {currentUser, auth} = useAuth()
  const {data: client} = useQuery(
    `${QUERIES.CLIENTS_LIST}-user-${itemIdForUpdate}`,
    () => {
      return getClientById(itemIdForUpdate, auth!.token)
    },
    {
      cacheTime: 0,
      enabled: enabledQuery,
      onError: (err) => {
        setItemIdForUpdate(undefined)
        console.error(err)
      },
    }
  )
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='clients'
          element={
            <>
              <PageTitle breadcrumbs={clientsBreadcrumbs}>Client list</PageTitle>
              <ClientsListWrapper />
            </>
          }
        />
        <Route
          path='/clients/view/:id'
          element={
            <>
              {/* <PageTitle>Client View</PageTitle> */}
              <ClientView className={''} client={client} />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/client-management/clients' />} />
    </Routes>
  )
}

export default ClientPage
