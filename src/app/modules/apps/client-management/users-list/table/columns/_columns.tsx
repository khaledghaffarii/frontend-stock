// @ts-nocheck
import {Column} from 'react-table'
import {ClientInfoCell} from './ClientInfoCell'
import {ClientLastLoginCell} from './ClientLastLoginCell'
import {ClientTwoStepsCell} from './ClientTwoStepsCell'
import {ClientActionsCell} from './ClientActionsCell'
import {ClientSelectionCell} from './ClientSelectionCell'
import {ClientCustomHeader} from './ClientCustomHeader'
import {ClientSelectionHeader} from './ClientSelectionHeader'
import {Client} from '../../core/_models'
import moment from 'moment'
import {formatPhone, handleStatus, truncateString} from '../../../../../../../_metronic/helpers'
const ClientsColumns: ReadonlyArray<Column<Client>> = [
  {
    Header: (props) => <ClientSelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({...props}) => <ClientSelectionCell id={props.data[props.row.index].id} />,
  },
  {
    Header: 'ID',
    id: 'rowNumber',
    Cell: ({row, data}) => <div>{data.length - row.index}</div>,
  },
  {
    Header: (props) => (
      <ClientCustomHeader tableProps={props} title='Full name' className='min-w-125px' />
    ),
    accessor: 'fullname',
    Cell: ({row}) => <ClientInfoCell client={row.original} />,
    //Cell: ({...props}) => <ClientInfoCell Client={props.data} />,
    // Cell: ({...props}) => {
    //   console.log('🚀 ~ props:', props.data[props.row.index])
    // },
  },
  {
    Header: (props) => (
      <ClientCustomHeader tableProps={props} title='created At' className='min-w-125px' />
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
      <ClientCustomHeader tableProps={props} title='email' className='min-w-125px' />
    ),
    accessor: 'email',
  },
  {
    Header: (props) => (
      <ClientCustomHeader tableProps={props} title='Phone' className='min-w-125px' />
    ),
    accessor: 'telephone',
    Cell: ({row}) => (
      <div style={{marginTop: 14}}>
        <p style={{}}>{formatPhone(row.original.phone)}</p>
      </div>
    ),
  },
  {
    Header: (props) => (
      <ClientCustomHeader tableProps={props} title='Company' className='min-w-125px' />
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
      <ClientCustomHeader tableProps={props} title='Address' className='min-w-125px' />
    ),
    accessor: 'address',
    Cell: ({row}) => (
      <div style={{marginTop: 14}}>
        <p style={{}}>{truncateString(row.original.address, 15)}</p>
      </div>
    ),
  },
]

export {ClientsColumns}
