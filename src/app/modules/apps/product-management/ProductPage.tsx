import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {ProductListWrapper} from './product-list/ClientList'
import {QUERIES, isNotEmpty} from '../../../../_metronic/helpers'
import {useQuery} from 'react-query'
import {useAuth} from '../../auth'
import {useListView} from './product-list/core/ListViewProvider'
import {getProductById} from './product-list/core/_requests'
import {useIntl} from 'react-intl'
import ProductView from './ProductView'

const productsBreadcrumbs: Array<PageLink> = [
  {
    title: 'Client Management',
    path: '/apps/product-management/product',
    isSeparator: false,
    isActive: false,
  },
  {
    title: 'Client View',
    path: '/apps/product-management/product/view',
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

const ProductPage = () => {
  const {itemIdForUpdate, setItemIdForUpdate} = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)
  const {currentUser, auth} = useAuth()
  const {data: product} = useQuery(
    `${QUERIES.PRODUCT_LIST}-user-${itemIdForUpdate}`,
    () => {
      return getProductById(itemIdForUpdate, auth!.token)
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
          path='product'
          element={
            <>
              <PageTitle breadcrumbs={productsBreadcrumbs}>Client list</PageTitle>
              <ProductListWrapper />
            </>
          }
        />
        <Route
          path='/product/view/:id'
          element={
            <>
              {/* <PageTitle>Client View</PageTitle> */}
              <ProductView className={''} product={product} />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/product-management/product' />} />
    </Routes>
  )
}

export default ProductPage
