import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {SupplierListWrapper} from './users-list/SupplierList'
import SupplierView from './SupplierView'
import {useListView} from './users-list/core/ListViewProvider'
import {QUERIES, isNotEmpty} from '../../../../_metronic/helpers'
import {useAuth} from '../../auth'
import {useQuery} from 'react-query'
import {getSupplierById} from './users-list/core/_requests'

const supplierBreadcrumbs: Array<PageLink> = [
  {
    title: 'Gestion des fournisseurs',
    path: '/apps/supplier-management/suppliers',
    isSeparator: false,
    isActive: false,
  },
  {
    title: 'Détail fournisseur',
    path: '/apps/supplier-management/suppliers/view',
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

const SupplierPage = () => {
  const {itemIdForUpdate, setItemIdForUpdate} = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)
  const {currentUser, auth} = useAuth()
  const {data: supplier} = useQuery(
    `${QUERIES.CLIENTS_LIST}-user-${itemIdForUpdate}`,
    () => {
      return getSupplierById(itemIdForUpdate, auth!.token)
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
          path='suppliers'
          element={
            <>
              <PageTitle breadcrumbs={supplierBreadcrumbs}>List des fournisseur</PageTitle>
              <SupplierListWrapper />
            </>
          }
        />
        <Route
          path='/suppliers/view/:id'
          element={
            <>
              {/* <PageTitle>Client View</PageTitle> */}
              <SupplierView className={''} supplier={supplier} />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/supplier-management/suppliers' />} />
    </Routes>
  )
}

export default SupplierPage
