// @ts-nocheck
import {Column} from 'react-table'
import {ProductInfoCell} from './ProductInfoCell'
import {ClientLastLoginCell} from './ProductLastLoginCell'
import {ClientTwoStepsCell} from './ProductTwoStepsCell'
import {ClientActionsCell} from './ProductActionsCell'
import {ProductSelectionCell} from './ProductSelectionCell'
import {ProductCustomHeader} from './ProductCustomHeader'
import {ProductSelectionHeader} from './ProductSelectionHeader'
import {Product} from '../../core/_models'
import moment from 'moment'
import {formatPhone, handleStatus, truncateString} from '../../../../../../../_metronic/helpers'
const ProductColumns: ReadonlyArray<Column<Product>> = [
  {
    Header: (props) => <ProductSelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({...props}) => <ProductSelectionCell id={props.data[props.row.index].id} />,
  },
  {
    Header: 'ID',
    id: 'rowNumber',
    Cell: ({row, data}) => <div>{data.length - row.index}</div>,
  },
  {
    Header: (props) => (
      <ProductCustomHeader tableProps={props} title='Full name' className='min-w-125px' />
    ),
    accessor: 'name',
    Cell: ({row}) => {
      console.log('🚀 ~ row:', row)
      return <ProductInfoCell product={row.original} />
    },
    //Cell: ({...props}) => <ClientInfoCell Client={props.data} />,
    // Cell: ({...props}) => {
    //   console.log('🚀 ~ props:', props.data[props.row.index])
    // },
  },
  {
    Header: (props) => (
      <ProductCustomHeader tableProps={props} title='created At' className='min-w-125px' />
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
      <ProductCustomHeader tableProps={props} title='Categories' className='min-w-125px' />
    ),
    accessor: 'category_id',
    Cell: ({row}) => (
      console.log('🚀 ~ row:', row?.original?.category?.name),
      (
        <div style={{marginTop: 14}}>
          <p style={{}}> {row?.original?.category?.name} </p>
        </div>
      )
    ),
  },
  {
    Header: (props) => (
      <ProductCustomHeader tableProps={props} title='quantity' className='min-w-125px' />
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
      <ProductCustomHeader tableProps={props} title='Quantité Minimal' className='min-w-125px' />
    ),
    accessor: 'minimalQuantity',
    Cell: ({row}) => (
      <div style={{marginTop: 14}}>
        <p style={{}}>{row.original.minimalQuantity}</p>
      </div>
    ),
  },
  {
    Header: (props) => (
      <ProductCustomHeader tableProps={props} title='Prix de vente - DT ' className='min-w-125px' />
    ),
    accessor: 'priceSale',
    Cell: ({row}) => (
      <div style={{marginTop: 14}}>
        <p style={{}}>{row.original.priceSale}</p>
      </div>
    ),
  },
]

export {ProductColumns}
