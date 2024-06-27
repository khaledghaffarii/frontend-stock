// @ts-nocheck
import {Column} from 'react-table'
import {SupplierInfoCell} from './SupplierInfoCell'
import {SupplierLastLoginCell} from './SupplierLastLoginCell'
import {SupplierTwoStepsCell} from './SupplierTwoStepsCell'
import {SupplierActionsCell} from './SupplierActionsCell'
import {SupplierSelectionCell} from './SupplierSelectionCell'
import {SupplierCustomHeader} from './SupplierCustomHeader'
import {SupplierSelectionHeader} from './SupplierSelectionHeader'
import {Supplier} from '../../core/_models'
import moment from 'moment'
import {formatPhone, truncateString} from '../../../../../../../_metronic/helpers'
const supplierColumns: ReadonlyArray<Column<Supplier>> = [
  {
    Header: (props) => <SupplierSelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({...props}) => <SupplierSelectionCell id={props.data[props.row.index].id} />,
  },
  {
    Header: 'ID',
    id: 'rowNumber',
    Cell: ({row, data}) => <div>{data.length - row.index}</div>,
  },
  {
    Header: (props) => (
      <SupplierCustomHeader tableProps={props} title='Full name' className='min-w-125px' />
    ),
    accessor: 'fullname',
    Cell: ({row}) => <SupplierInfoCell supplier={row.original} />,
  },
  {
    Header: (props) => (
      <SupplierCustomHeader tableProps={props} title='created At' className='min-w-125px' />
    ),
    accessor: 'createdAt',
    Cell: ({row}) => (
      <div style={{marginTop: 14}}>
        <p style={{}}>{moment(row.original.createdAt).format('DD MMMM YYYY, HH:mm')}</p>
      </div>
    ),
  },
  {
    Header: (props) => (
      <SupplierCustomHeader tableProps={props} title='email' className='min-w-125px' />
    ),
    accessor: 'email',
  },
  {
    Header: (props) => (
      <SupplierCustomHeader tableProps={props} title='Phone' className='min-w-125px' />
    ),
    accessor: 'telephone',
    Cell: ({row}) => (
      <div style={{marginTop: 14}}>
        <p style={{}}>{row.original.phone}</p>
      </div>
    ),
  },
  {
    Header: (props) => (
      <SupplierCustomHeader tableProps={props} title='Company' className='min-w-125px' />
    ),
    accessor: 'company',
    Cell: ({row}) => (
      <div style={{marginTop: 14}}>
        <p style={{}}>{row.original.company}</p>
      </div>
    ),
  },
  {
    Header: (props) => (
      <SupplierCustomHeader tableProps={props} title='Address' className='min-w-125px' />
    ),
    accessor: 'address',
    Cell: ({row}) => (
      <div style={{marginTop: 14}}>
        <p style={{}}>{truncateString(row.original.address, 15)}</p>
      </div>
    ),
  },
]

export {supplierColumns}
