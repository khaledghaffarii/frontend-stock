// @ts-nocheck
import {Column} from 'react-table'
import {AchatInfoCell} from './AchatInfoCell'
import {ClientLastLoginCell} from './AchatLastLoginCell'
import {ClientTwoStepsCell} from './AchatTwoStepsCell'
import {ClientActionsCell} from './AchatActionsCell'
import {AchatSelectionCell} from './AchatSelectionCell'
import {AchatCustomHeader} from './AchatCustomHeader'
import {AchatSelectionHeader} from './AchatSelectionHeader'
import {Achat} from '../../core/_models'
import moment from 'moment'
import {formatPhone, handleStatus, truncateString} from '../../../../../../../_metronic/helpers'
const AchatColumns: ReadonlyArray<Column<Achat>> = [
  {
    Header: (props) => <AchatSelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({...props}) => <AchatSelectionCell id={props.data[props.row.index].id} />,
  },
  {
    Header: 'ID',
    id: 'rowNumber',
    Cell: ({row, data}) => <div>{data.length - row.index}</div>,
  },
  {
    Header: (props) => (
      <AchatCustomHeader tableProps={props} title='Reference ' className='min-w-125px' />
    ),
    // Cell: ({row, data}) => <div>{data.length - row.index}</div>,
    accessor: 'refInvoice',
    Cell: ({row}) => {
      console.log('🚀 ~ row:', row)
      return <AchatInfoCell achat={row.original} />
    },
  },
  {
    Header: (props) => (
      <AchatCustomHeader tableProps={props} title='Produit acheter' className='min-w-125px' />
    ),
    accessor: 'product_id',
    // Cell: ({row}) => {
    //   console.log('🚀 ~ row:', row)
    //   return <AchatInfoCell achat={row.original} />
    // },
    Cell: ({row}) => (
      <div style={{marginTop: 14}}>
        <p style={{}}>{row.original.product?.name}</p>
      </div>
    ),
    //Cell: ({...props}) => <ClientInfoCell Client={props.data} />,
    // Cell: ({...props}) => {
    //   console.log('🚀 ~ props:', props.data[props.row.index])
    // },
  },
  {
    Header: (props) => (
      <AchatCustomHeader tableProps={props} title='Date creation' className='min-w-125px' />
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
      <AchatCustomHeader tableProps={props} title='Fournisseur' className='min-w-125px' />
    ),
    accessor: 'supplier_id',
    Cell: ({row}) => (
      console.log('🚀 ~ row: supplier', row?.original),
      (
        <div style={{marginTop: 14}}>
          <p style={{}}> {row?.original?.supplier?.fullname} </p>
        </div>
      )
    ),
  },
  {
    Header: (props) => (
      <AchatCustomHeader tableProps={props} title='Quantité' className='min-w-125px' />
    ),
    accessor: 'quantity',
    Cell: ({row}) => (
      <div style={{marginTop: 14}}>
        <p style={{}}>{row.original.quantity}</p>
      </div>
    ),
  },
  {
    Header: (props) => (
      <AchatCustomHeader tableProps={props} title='Prix unitaire - TND' className='min-w-125px' />
    ),
    accessor: 'unitPurchasePrice',
    Cell: ({row}) => (
      <div style={{marginTop: 14}}>
        <p style={{}}>{row?.original?.unitPurchasePrice?.toFixed(2)}</p>
      </div>
    ),
  },
  {
    Header: (props) => (
      <AchatCustomHeader tableProps={props} title='Prix dtotal - TND ' className='min-w-125px' />
    ),
    accessor: 'totalPurchasePrice',
    Cell: ({row}) => (
      <div style={{marginTop: 14}}>
        <p style={{}}>{row.original?.totalPurchasePrice?.toFixed(2)}</p>
      </div>
    ),
  },
]

export {AchatColumns}
