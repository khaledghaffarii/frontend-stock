import {useMemo} from 'react'
import {useTable, ColumnInstance, Row} from 'react-table'
import {CustomHeaderColumn} from './columns/CustomHeaderColumn'
import {CustomRow} from './columns/CustomRow'
import {useQueryResponseData, useQueryResponseLoading} from '../core/QueryResponseProvider'
import {CategoryColumns} from './columns/_columns'
import {Category} from '../core/_models'
import {CategoryListLoading} from '../components/loading/CategoryListLoading'
import {CategoryListPagination} from '../components/pagination/CategoryListPagination'
import {KTCardBody} from '../../../../../../_metronic/helpers'
import {useQueryRequest} from '../core/QueryRequestProvider'

const CategoryTable = () => {
  const {state} = useQueryRequest()
  const category = useQueryResponseData()
  const isLoading = useQueryResponseLoading()

  const filteredData = useMemo(() => {
    if (!state.search) return category
    return category.filter((client: Category) =>
      //@ts-ignore
      client?.name?.toLowerCase().includes(state.search.toLowerCase())
    )
  }, [category, state.search])

  const columns = useMemo(() => CategoryColumns, [])
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
                {headerGroup.headers.map((column: ColumnInstance<Category>) => (
                  <CustomHeaderColumn key={column.id} column={column} />
                ))}
              </tr>
            ))}
          </thead>
          <tbody className='text-gray-600 fw-bold' {...getTableBodyProps()}>
            {rows.length > 0 ? (
              rows.map((row: Row<Category>, i) => {
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
      <CategoryListPagination />
      {isLoading && <CategoryListLoading />}
    </KTCardBody>
  )
}

export {CategoryTable}
