/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState} from 'react'
import {KTSVG} from '../../../_metronic/helpers'

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

const TotalProduct: React.FC<Props> = ({
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
  //   useEffect(() => {
  //     const fetchData = async () => {
  //       try {
  //         const token = auth?.token
  //         if (token) {
  //           const data = await getTotalProduct(token)
  //           //@ts-ignore
  //           setDataNbeSupplier(data?.data.totalProducts)
  //         }
  //       } catch (error) {
  //         console.log('🚀 ~ fetchData ~ error:', error)
  //       }
  //     }
  //     fetchData()
  //   }, [])
  return (
    <p
      onClick={() => {
        navigate(`/apps/supplier-management/suppliers`)
      }}
      style={{cursor: 'pointer'}}
      className={`card bg-${color} hoverable ${className}`}
    >
      <div className='d-flex flex-row w-75'>
        <div className='card-body'>
          <KTSVG
            path={svgIcon}
            className={`svg-icon-${iconColor} svg-icon-5x ms-n1 text-success `}
          />
        </div>
        <div className='d-flex flex-column mt-5'>
          <div className={`text-primary  fw-bold fs-2  mt-5`}> Stock product</div>
          <div className={`text-primary  fw-bold fs-2 mb-2 `}>150 </div>
        </div>
      </div>
    </p>
  )
}

export {TotalProduct}
