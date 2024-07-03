import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {SaleListWrapper} from './sale-list/SaleList'
import {QUERIES, isNotEmpty} from '../../../../_metronic/helpers'
import {useQuery} from 'react-query'
import {useAuth} from '../../auth'
import {useListView} from './sale-list/core/ListViewProvider'
import {getSaleById} from './sale-list/core/_requests'
import {useIntl} from 'react-intl'
import SaleView from './SaleView'

const salesBreadcrumbs: Array<PageLink> = [
  {
    title: 'Géstion des vente',
    path: '/apps/sale-management/sale',
    isSeparator: false,
    isActive: false,
  },
  {
    title: 'Détail vente ',
    path: '/apps/sale-management/sale/view',
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

const SalePage = () => {
  const {itemIdForUpdate, setItemIdForUpdate} = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)
  const {currentUser, auth} = useAuth()
  const {data: sale} = useQuery(
    `${QUERIES.SALE_LIST}-user-${itemIdForUpdate}`,
    () => {
      return getSaleById(itemIdForUpdate, auth!.token)
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
          path='sale'
          element={
            <>
              <PageTitle breadcrumbs={salesBreadcrumbs}>List des ventes</PageTitle>
              <SaleListWrapper />
            </>
          }
        />
        <Route
          path='/sale/view/:id'
          element={
            <>
              {/* <PageTitle>Client View</PageTitle> */}
              <SaleView className={''} sale={sale} />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/sale-management/sale' />} />
    </Routes>
  )
}

export default SalePage
