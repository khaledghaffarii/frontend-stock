/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import {FC} from 'react'
import {toAbsoluteUrl} from '../../../../../../../_metronic/helpers'
import {Sale} from '../../core/_models'
import {useNavigate} from 'react-router-dom'

type Props = {
  sale: Sale
}

const LivraisonInfoCell: FC<Props> = ({sale}) => {
  console.log('🚀 ~ sale 177:', sale)
  const navigate = useNavigate()
  return (
    <div className='d-flex align-items-center'>
      {/* begin:: Avatar */}
      <div className=''></div>
      <div className=''>
        <p
          onClick={() => {
            navigate(`/apps/sale-management/sale/livraison/view/${sale.id}`)
          }}
          className='text-primary mt-4'
          style={{
            cursor: 'pointer',
            // opacity: '0.5',
            // background: achat.color !== '' ? achat.color : '',
          }}
        >
          {sale.refInvoice}
        </p>
      </div>
    </div>
  )
}

export {LivraisonInfoCell}
