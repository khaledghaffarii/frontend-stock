/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'
import {KTSVG} from '../../../_metronic/helpers'
import {getTotalClient} from '../apps/client-management/users-list/core/_requests'
import {useAuth} from '../auth'
import {useNavigate} from 'react-router-dom'

type Props = {
  className: string
  color: string
  svgIcon: string
  iconColor: string
  title: string
  titleColor?: string
  description: string
  descriptionColor?: string
}

const TotalCutomer: React.FC<Props> = ({
  className,
  color,
  svgIcon,
  iconColor,
  title,
  titleColor,
  description,
  descriptionColor,
}) => {
  const [dataNbeClient, setDataNbeClient] = useState<any>([''])
  const navigate = useNavigate()
  const {currentUser, auth} = useAuth()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = auth?.token
        if (token) {
          const data = await getTotalClient(token)
          //@ts-ignore
          setDataNbeClient(data?.data.totalClients)
        }
      } catch (error) {
        console.log('🚀 ~ fetchData ~ error:', error)
      }
    }
    fetchData()
  }, [])
  return (
    <p
      onClick={() => {
        navigate(`/apps/client-management/clients`)
      }}
      style={{cursor: 'pointer'}}
      className={`card bg-${color} hoverable ${className}`}
    >
      <div className='d-flex flex-row'>
        <div className='card-body'>
          <KTSVG path={svgIcon} className={`svg-icon-${iconColor} svg-icon-5x ms-n1`} />
        </div>

        <div className={`text-primary  fw-bold fs-2 mb-2 mt-5`}> Client</div>
        <div className={`text-primary  fw-bold fs-2 mb-2 mt-5`}>{dataNbeClient} </div>
      </div>
    </p>
  )
}

export {TotalCutomer}
