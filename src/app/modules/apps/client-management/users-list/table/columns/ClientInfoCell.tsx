/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import {FC} from 'react'
import {toAbsoluteUrl} from '../../../../../../../_metronic/helpers'
import {Client} from '../../core/_models'
import {useNavigate} from 'react-router-dom'

type Props = {
  client: Client
}

const ClientInfoCell: FC<Props> = ({client}) => {
  const navigate = useNavigate()
  return (
    <div className='d-flex align-items-center'>
      {/* begin:: Avatar */}
      <div className='symbol symbol-circle symbol-50px overflow-hidden me-3'></div>
      <div className='d-flex flex-column'>
        <p
          onClick={() => {
            navigate(`/apps/client-management/clients/view/${client.id}`)
          }}
          className='text-primary mt-3'
          style={{cursor: 'pointer'}}
        >
          {client.fullname}
        </p>
        <a href='#' className='text-gray-800 text-hover-primary mb-1'></a>
      </div>
    </div>
  )
}

export {ClientInfoCell}
