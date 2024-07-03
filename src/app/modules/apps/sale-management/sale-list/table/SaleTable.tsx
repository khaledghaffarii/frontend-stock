import {useMemo} from 'react'
import {useTable, ColumnInstance, Row} from 'react-table'
import {CustomHeaderColumn} from './columns/CustomHeaderColumn'
import {CustomRow} from './columns/CustomRow'
import {useQueryResponseData, useQueryResponseLoading} from '../core/QueryResponseProvider'
import {SaleColumns} from './columns/_columns'
import {Sale} from '../core/_models'
import {SaleListLoading} from '../components/loading/SaleListLoading'
import {SaleListPagination} from '../components/pagination/SaleListPagination'
import {KTCardBody} from '../../../../../../_metronic/helpers'
import {useQueryRequest} from '../core/QueryRequestProvider'

const SaleTable = () => {
  const {state} = useQueryRequest()
  const achats = useQueryResponseData()
  const isLoading = useQueryResponseLoading()

  const filteredData = useMemo(() => {
    if (!state.search) return achats
    return achats.filter(
      (achat: Sale) =>
        //@ts-ignore
        achat?.refInvoice?.toLowerCase().includes(state.search.toLowerCase()) ||
        //@ts-ignore
        achat?.product.name?.toLowerCase().includes(state?.search?.toLowerCase()) ||
        //@ts-ignore
        achat?.supplier.fullname?.toLowerCase().includes(state?.search?.toLowerCase())
    )
  }, [achats, state.search])

  const columns = useMemo(() => SaleColumns, [])
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
                {headerGroup.headers.map((column: ColumnInstance<Sale>) => (
                  <CustomHeaderColumn key={column.id} column={column} />
                ))}
              </tr>
            ))}
          </thead>
          <tbody className='text-gray-600 fw-bold' {...getTableBodyProps()}>
            {rows.length > 0 ? (
              rows.map((row: Row<Sale>, i) => {
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
      <SaleListPagination />
      {isLoading && <SaleListLoading />}
    </KTCardBody>
  )
}

export {SaleTable}
