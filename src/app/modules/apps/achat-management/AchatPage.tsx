import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {AchatListWrapper} from './achat-list/AchatList'
import {QUERIES, isNotEmpty} from '../../../../_metronic/helpers'
import {useQuery} from 'react-query'
import {useAuth} from '../../auth'
import {useListView} from './achat-list/core/ListViewProvider'
import {getAchatById} from './achat-list/core/_requests'
import {useIntl} from 'react-intl'
import AchatView from './AchatView'

const achatsBreadcrumbs: Array<PageLink> = [
  {
    title: 'Client Management',
    path: '/apps/achat-management/achat',
    isSeparator: false,
    isActive: false,
  },
  {
    title: 'Client View',
    path: '/apps/achat-management/achat/view',
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

const AchatPage = () => {
  const {itemIdForUpdate, setItemIdForUpdate} = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)
  const {currentUser, auth} = useAuth()
  const {data: achat} = useQuery(
    `${QUERIES.ACHAT_LIST}-user-${itemIdForUpdate}`,
    () => {
      return getAchatById(itemIdForUpdate, auth!.token)
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
          path='achat'
          element={
            <>
              <PageTitle breadcrumbs={achatsBreadcrumbs}>Client list</PageTitle>
              <AchatListWrapper />
            </>
          }
        />
        <Route
          path='/achat/view/:id'
          element={
            <>
              {/* <PageTitle>Client View</PageTitle> */}
              <AchatView className={''} achat={achat} />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/achat-management/achat' />} />
    </Routes>
  )
}

export default AchatPage
