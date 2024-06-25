// @ts-nocheck
import {Column} from 'react-table'
import {CategoryInfoCell} from './CategoryInfoCell'
import {ClientLastLoginCell} from './CategoryLastLoginCell'
import {ClientTwoStepsCell} from './CategoryTwoStepsCell'
import {ClientActionsCell} from './CategoryActionsCell'
import {CategorySelectionCell} from './CategorySelectionCell'
import {CategoryCustomHeader} from './CategoryCustomHeader'
import {CategorySelectionHeader} from './CategorySelectionHeader'
import {Category} from '../../core/_models'
import moment from 'moment'
import {formatPhone, handleStatus, truncateString} from '../../../../../../../_metronic/helpers'
const CategoryColumns: ReadonlyArray<Column<Category>> = [
  {
    Header: (props) => <CategorySelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({...props}) => <CategorySelectionCell id={props.data[props.row.index].id} />,
  },
  {
    Header: 'ID',
    id: 'rowNumber',
    Cell: ({row, data}) => <div>{data.length - row.index}</div>,
  },
  {
    Header: (props) => (
      <CategoryCustomHeader tableProps={props} title='Nom category' className='min-w-125px' />
    ),
    accessor: 'name',
    Cell: ({row}) => (
      console.log('🚀 ~ row:', row.original), (<CategoryInfoCell category={row.original} />)
    ),
  },
  {
    Header: (props) => (
      <CategoryCustomHeader tableProps={props} title='Date de creation' className='min-w-125px' />
    ),
    accessor: 'createdAt',
    Cell: ({row}) => (
      <div style={{marginTop: 14}}>
        <p style={{}}>{moment(row.original.createdAt).format('DD MMMM YYYY, HH:mm')}</p>
      </div>
    ),
  },
]

export {CategoryColumns}
