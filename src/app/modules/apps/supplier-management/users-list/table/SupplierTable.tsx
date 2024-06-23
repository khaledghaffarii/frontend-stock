import {useMemo} from 'react'
import {useTable, ColumnInstance, Row} from 'react-table'
import {CustomHeaderColumn} from './columns/CustomHeaderColumn'
import {CustomRow} from './columns/CustomRow'
import {useQueryResponseData, useQueryResponseLoading} from '../core/QueryResponseProvider'
import {supplierColumns} from './columns/_columns'
import {Supplier} from '../core/_models'
import {SupplierListLoading} from '../components/loading/SupplierListLoading'
import {SupplierListPagination} from '../components/pagination/SupplierListPagination'
import {KTCardBody} from '../../../../../../_metronic/helpers'

const SupplierTable = () => {
  const supplier = useQueryResponseData()
  const isLoading = useQueryResponseLoading()
  const data = useMemo(() => supplier, [supplier])
  const columns = useMemo(() => supplierColumns, [])
  const {getTableProps, getTableBodyProps, headers, rows, prepareRow} = useTable({
    columns,
    data,
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
            <tr className='text-start text-muted fw-bolder fs-7 text-uppercase gs-0'>
              {headers.map((column: ColumnInstance<Supplier>) => (
                <CustomHeaderColumn key={column.id} column={column} />
              ))}
            </tr>
          </thead>
          <tbody className='text-gray-600 fw-bold' {...getTableBodyProps()}>
            {rows.length > 0 ? (
              rows.map((row: Row<Supplier>, i) => {
                prepareRow(row)
                return <CustomRow row={row} key={`row-${i}-${row.id}`} />
              })
            ) : (
              <tr>
                <td colSpan={7}>
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
