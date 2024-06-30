/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'
import {KTSVG} from '../../../_metronic/helpers'

import {useAuth} from '../auth'
import {getTotalSupplier} from '../apps/supplier-management/users-list/core/_requests'
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

const TotalSupplier: React.FC<Props> = ({
  className,
  color,
  svgIcon,
  iconColor,
  title,
  titleColor,
  description,
  descriptionColor,
}) => {
  const [dataNbeSupplier, setDataNbeSupplier] = useState<any>([''])
  const navigate = useNavigate()
  const {currentUser, auth} = useAuth()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = auth?.token
        if (token) {
          const data = await getTotalSupplier(token)
          //@ts-ignore
          setDataNbeSupplier(data?.data.totalSuppliers)
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
        navigate(`/apps/supplier-management/suppliers`)
      }}
      style={{cursor: 'pointer'}}
      className={`card bg-${color} hoverable ${className}`}
    >
      <div className='d-flex flex-row w-25'>
        <div className='card-body'>
          <KTSVG
            path={svgIcon}
            className={`svg-icon-${iconColor} svg-icon-5x ms-n1 text-danger `}
          />
        </div>
        <div className='d-flex flex-column mt-5'>
          <div className={`text-dark  fw-bold fs-3  mt-2`}> Fournisseurs</div>
          <div className={`text-dark  fw-bold fs-1 mb-2 `}>{dataNbeSupplier} </div>
        </div>
      </div>
    </p>
  )
}

export {TotalSupplier}
