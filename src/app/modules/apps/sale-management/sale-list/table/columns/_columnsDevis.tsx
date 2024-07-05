// @ts-nocheck
import {Column} from 'react-table'
import {SaleInfoCell} from './SaleInfoCell'

import {SaleSelectionCell} from './SaleSelectionCell'
import {SaleCustomHeader} from './SaleCustomHeader'
import {SaleSelectionHeader} from './SaleSelectionHeader'
import {Achat} from '../../core/_models'
import moment from 'moment'
import {formatPhone, handleStatus, truncateString} from '../../../../../../../_metronic/helpers'
import {SaleActionsCell} from './SaleActionsCell'
const SaleColumnsDevis: ReadonlyArray<Column<Achat>> = [
  {
    Header: (props) => <SaleSelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({...props}) => <SaleSelectionCell id={props.data[props.row.index].id} />,
  },
  {
    Header: 'ID',
    id: 'rowNumber',
    Cell: ({row, data}) => <div>{data.length - row.index}</div>,
  },
  {
    Header: (props) => (
      <SaleCustomHeader tableProps={props} title='Reference ' className='min-w-125px' />
    ),
    // Cell: ({row, data}) => <div>{data.length - row.index}</div>,
    accessor: 'refInvoice',
    Cell: ({row}) => {
      console.log('🚀 ~ row:', row)
      return <SaleInfoCell sale={row.original} />
    },
  },
  {
    Header: (props) => (
      <SaleCustomHeader tableProps={props} title='Produit vendu' className='min-w-125px' />
    ),
    accessor: 'product_id',
    // Cell: ({row}) => {
    //   console.log('🚀 ~ row:', row)
    //   return <SaleInfoCell achat={row.original} />
    // },
    Cell: ({row}) => (
      <div style={{marginTop: 14}}>
        <p style={{color: '#000'}}>{row.original.product?.name}</p>
      </div>
    ),
    //Cell: ({...props}) => <ClientInfoCell Client={props.data} />,
    // Cell: ({...props}) => {
    //   console.log('🚀 ~ props:', props.data[props.row.index])
    // },
  },
  {
    Header: (props) => (
      <SaleCustomHeader tableProps={props} title='Date creation' className='min-w-125px' />
    ),
    accessor: 'createdAt',
    Cell: ({row}) => (
      <div style={{marginTop: 14}}>
        <p style={{color: '#000'}}>
          {moment(row.original.createdAt).format('DD MMMM YYYY, HH:mm')}
        </p>
      </div>
    ),
  },
  {
    Header: (props) => (
      <SaleCustomHeader tableProps={props} title='Client' className='min-w-125px' />
    ),
    accessor: 'client_id',
    Cell: ({row}) => (
      console.log('🚀 ~ row: supplier', row?.original),
      (
        <div style={{marginTop: 14}}>
          <p style={{color: '#000'}}> {row?.original?.client?.fullname} </p>
        </div>
      )
    ),
  },
  {
    Header: (props) => (
      <SaleCustomHeader tableProps={props} title='Quantité' className='min-w-125px' />
    ),
    accessor: 'quantity',
    Cell: ({row}) => (
      <div style={{marginTop: 14}}>
        <p style={{color: '#000'}}>{row.original.quantity}</p>
      </div>
    ),
  },
  {
    Header: (props) => (
      <SaleCustomHeader tableProps={props} title='Prix vente - TND' className='min-w-125px' />
    ),
    accessor: 'priceSale',
    Cell: ({row}) => (
      console.log(
        '🚀 ~ row?.original?.product?.priceSale:',
        row?.original?.product?.priceSale.toFixed(3)
      ),
      (
        <div style={{marginTop: 14}}>
          <p style={{color: '#000'}}>{row?.original?.product?.priceSale.toFixed(3)}</p>
        </div>
      )
    ),
  },
  {
    Header: (props) => (
      <SaleCustomHeader tableProps={props} title='Prix total - TND ' className='min-w-125px' />
    ),
    accessor: 'totalSalePrice',
    Cell: ({row}) => (
      <div style={{marginTop: 14}}>
        <p style={{color: '#000'}}>{row.original?.totalSalePrice?.toFixed(3)}</p>
      </div>
    ),
  },
  {
    Header: (props) => (
      <SaleCustomHeader tableProps={props} title='Date de vente' className='min-w-125px' />
    ),
    accessor: 'saleDate',
    Cell: ({row}) => (
      <div style={{marginTop: 14}}>
        <p style={{color: '#000'}}>{moment(row.original.saleDate).format('DD MMMM YYYY, HH:mm')}</p>
      </div>
    ),
  },
  //   {
  //     Header: (props) => (
  //       <SaleCustomHeader tableProps={props} title='Action' className='min-w-125px' />
  //     ),
  //     accessor: 'action',
  //     Cell: ({row}) => (
  //       <div style={{marginTop: 14}}>
  //         <button onClick={''}>convertir</button>
  //       </div>
  //     ),
  //   },
]

export {SaleColumnsDevis}
