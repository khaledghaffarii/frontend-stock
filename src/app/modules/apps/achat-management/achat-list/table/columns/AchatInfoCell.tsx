/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import {FC} from 'react'
import {toAbsoluteUrl} from '../../../../../../../_metronic/helpers'
import {Achat} from '../../core/_models'
import {useNavigate} from 'react-router-dom'

type Props = {
  achat: Achat
}

const AchatInfoCell: FC<Props> = ({achat}) => {
  console.log('🚀 ~ achat:', achat)
  const navigate = useNavigate()
  return (
    <div className='d-flex align-items-center'>
      {/* begin:: Avatar */}
      <div className='symbol symbol-circle symbol-50px overflow-hidden me-3'></div>
      <div className='d-flex flex-column'>
        <p
          onClick={() => {
            navigate(`/apps/achat-management/achat/view/${achat.id}`)
          }}
          className='text-primary mt-5'
          style={{
            cursor: 'pointer',
            // opacity: '0.5',
            // background: achat.color !== '' ? achat.color : '',
          }}
        >
          {achat.product?.name}
        </p>
        <a href='#' className='text-gray-800 text-hover-primary mb-1'></a>
      </div>
    </div>
  )
}

export {AchatInfoCell}
