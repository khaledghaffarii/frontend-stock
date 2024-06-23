import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {SupplierListWrapper} from './users-list/SupplierList'

const supplierBreadcrumbs: Array<PageLink> = [
  {
    title: 'Supplier Management',
    path: '/apps/supplier-management/suppliers',
    isSeparator: false,
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
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='suppliers'
          element={
            <>
              <PageTitle breadcrumbs={supplierBreadcrumbs}>Suppliers list</PageTitle>
              <SupplierListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/supplier-management/suppliers' />} />
    </Routes>
  )
}

export default SupplierPage
