import {useMemo} from 'react'
import {useTable, ColumnInstance, Row} from 'react-table'
import {CustomHeaderColumn} from './columns/CustomHeaderColumn'
import {CustomRow} from './columns/CustomRow'
import {useQueryResponseData, useQueryResponseLoading} from '../core/QueryResponseProvider'
import {AchatColumns} from './columns/_columns'
import {Achat} from '../core/_models'
import {AchatListLoading} from '../components/loading/AchatListLoading'
import {AchatListPagination} from '../components/pagination/AchatListPagination'
import {KTCardBody} from '../../../../../../_metronic/helpers'
import {useQueryRequest} from '../core/QueryRequestProvider'

const AchatTable = () => {
  const {state} = useQueryRequest()
  const achats = useQueryResponseData()
  const isLoading = useQueryResponseLoading()

  const filteredData = useMemo(() => {
    if (!state.search) return achats
    return achats.filter(
      (achat: Achat) =>
        //@ts-ignore
        achat?.name?.toLowerCase().includes(state.search.toLowerCase()) ||
        //@ts-ignore
        achat?.category.name?.toLowerCase().includes(state?.search?.toLowerCase())
    )
  }, [achats, state.search])

  const columns = useMemo(() => AchatColumns, [])
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
                {headerGroup.headers.map((column: ColumnInstance<Achat>) => (
                  <CustomHeaderColumn key={column.id} column={column} />
                ))}
              </tr>
            ))}
          </thead>
          <tbody className='text-gray-600 fw-bold' {...getTableBodyProps()}>
            {rows.length > 0 ? (
              rows.map((row: Row<Achat>, i) => {
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
      <AchatListPagination />
      {isLoading && <AchatListLoading />}
    </KTCardBody>
  )
}

export {AchatTable}
