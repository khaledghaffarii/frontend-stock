import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {
  SaleListWrapperCommande,
  SaleListWrapperDevis,
  SaleListWrapperFacture,
  SaleListWrapperLivraison,
} from './sale-list/SaleList'
import {QUERIES, isNotEmpty} from '../../../../_metronic/helpers'
import {useQuery} from 'react-query'
import {useAuth} from '../../auth'
import {useListView} from './sale-list/core/ListViewProvider'
import {getSaleById} from './sale-list/core/_requests'
import {useIntl} from 'react-intl'
import SaleView from './SaleView'

const salesBreadcrumbs: Array<PageLink> = [
  {
    title: 'Géstion des Bon de commande',
    path: '/apps/sale-management/sale/commande',
    isSeparator: false,
    isActive: false,
  },
  {
    title: 'Géstion des Devis',
    path: '/apps/sale-management/sale/devis',
    isSeparator: false,
    isActive: false,
  },
  {
    title: 'Géstion des Factures',
    path: '/apps/sale-management/sale/facture',
    isSeparator: false,
    isActive: false,
  },
  {
    title: 'Géstion des Bon de livraison',
    path: '/apps/sale-management/sale/livraison',
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
          path='sale/commande'
          element={
            <>
              <PageTitle breadcrumbs={salesBreadcrumbs}>List des facture</PageTitle>
              <SaleListWrapperCommande />
            </>
          }
        />
        <Route
          path='sale/facture'
          element={
            <>
              <PageTitle breadcrumbs={salesBreadcrumbs}>List des facture</PageTitle>
              <SaleListWrapperFacture />
            </>
          }
        />
        <Route
          path='sale/devis'
          element={
            <>
              <PageTitle breadcrumbs={salesBreadcrumbs}>List des devis</PageTitle>
              <SaleListWrapperDevis />
            </>
          }
        />
        <Route
          path='sale/livraison'
          element={
            <>
              <PageTitle breadcrumbs={salesBreadcrumbs}>List des Bon de livraison</PageTitle>
              <SaleListWrapperLivraison />
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
