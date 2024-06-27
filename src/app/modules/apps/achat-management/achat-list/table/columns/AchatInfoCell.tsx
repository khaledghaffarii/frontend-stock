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
      <div className=''></div>
      <div className=''>
        <p
          onClick={() => {
            navigate(`/apps/achat-management/achat/view/${achat.id}`)
          }}
          className='text-primary mt-3'
          style={{
            cursor: 'pointer',
            // opacity: '0.5',
            // background: achat.color !== '' ? achat.color : '',
          }}
        >
          {achat.product?.name}
        </p>
      </div>
    </div>
  )
}

export {AchatInfoCell}
