import {useMemo} from 'react'
import {useTable, ColumnInstance, Row} from 'react-table'
import {CustomHeaderColumn} from './columns/CustomHeaderColumn'
import {CustomRow} from './columns/CustomRow'
import {useQueryResponseData, useQueryResponseLoading} from '../core/QueryResponseProvider'

import {Supplier} from '../core/_models'
import {SupplierListLoading} from '../components/loading/SupplierListLoading'
import {SupplierListPagination} from '../components/pagination/SupplierListPagination'
import {KTCardBody} from '../../../../../../_metronic/helpers'
import {useQueryRequest} from '../core/QueryRequestProvider'
import {supplierColumns} from './columns/_columns'

const SupplierTable = () => {
  const {state} = useQueryRequest()
  const clients = useQueryResponseData()
  const isLoading = useQueryResponseLoading()

  const filteredData = useMemo(() => {
    if (!state.search) return clients
    return clients.filter(
      (client: Supplier) =>
        //@ts-ignore
        client?.fullname?.toLowerCase().includes(state.search.toLowerCase()) ||
        //@ts-ignore
        client?.email?.toLowerCase().includes(state?.search?.toLowerCase())
    )
  }, [clients, state.search])

  const columns = useMemo(() => supplierColumns, [])
  const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = useTable({
    columns,
    data: filteredData,
  })

  return (
    <KTCardBody className='py-4'>
      <div className='table-responsive'>
        <table
          id='kt_table_users'
          className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                className='text-start text-muted fw-bolder fs-7 text-uppercase gs-0'
              >
                {headerGroup.headers.map((column: ColumnInstance<Supplier>) => (
                  <CustomHeaderColumn key={column.id} column={column} />
                ))}
              </tr>
            ))}
          </thead>
          <tbody className='text-gray-600 fw-bold' {...getTableBodyProps()}>
            {rows.length > 0 ? (
              rows.map((row: Row<Supplier>, i) => {
                prepareRow(row)
                return <CustomRow row={row} key={`row-${i}-${row.id}`} />
              })
            ) : (
              <tr>
                <td colSpan={columns.length}>
                  <div className='d-flex text-center w-100 align-content-center justify-content-center'>
                    No matching records found
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <SupplierListPagination />
      {isLoading && <SupplierListLoading />}
    </KTCardBody>
  )
}

export {SupplierTable}
