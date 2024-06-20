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
        <p style={{}}>{formatPhone(row.original.telephone)}</p>
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
  {
    Header: (props) => (
      <ClientCustomHeader tableProps={props} title='Status' className='min-w-125px' />
    ),
    accessor: 'status',
    Cell: ({row}) => handleStatus(row.original.status),
  },
  {
    Header: (props) => (
      <ClientCustomHeader tableProps={props} title='Appel' className='min-w-125px' />
    ),
    accessor: ' ',
    Cell: ({row}) => (
      <div className=' cursor-pointer'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='20'
          height='20'
          fill='green'
          class='bi bi-telephone'
          viewBox='0 0 16 16'
        >
          <path d='M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z' />
        </svg>
      </div>
    ),
  },
]

export {ClientsColumns}
