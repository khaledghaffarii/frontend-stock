import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'

import {QUERIES, isNotEmpty} from '../../../../_metronic/helpers'
import {useQuery} from 'react-query'
import {useAuth} from '../../auth'
import {useListView} from './category-list/core/ListViewProvider'
import {getCategoryById} from './category-list/core/_requests'
import {useIntl} from 'react-intl'
import CategoryView from './CategoryView'
import {CategoryListWrapper} from './category-list/CategoryList'

const categoriesBreadcrumbs: Array<PageLink> = [
  {
    title: 'Category Management',
    path: '/apps/category-management/category',
    isSeparator: false,
    isActive: false,
  },
  {
    title: 'Category View',
    path: '/apps/category-management/category/view',
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

const CategoryPage = () => {
  const {itemIdForUpdate, setItemIdForUpdate} = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)
  const {currentUser, auth} = useAuth()
  const {data: category} = useQuery(
    `${QUERIES.CATEGORY_LIST}-user-${itemIdForUpdate}`,
    () => {
      return getCategoryById(itemIdForUpdate, auth!.token)
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
          path='category'
          element={
            <>
              <PageTitle breadcrumbs={categoriesBreadcrumbs}>Categorie list</PageTitle>
              <CategoryListWrapper />
            </>
          }
        />
        <Route
          path='/category/view/:id'
          element={
            <>
              {/* <PageTitle>category View</PageTitle> */}
              <CategoryView className={''} category={category} />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/category-management/category' />} />
    </Routes>
  )
}

export default CategoryPage
