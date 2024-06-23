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

const TotalPurchase: React.FC<Props> = ({
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
  //           const data = await getTotalPurchase(token)
  //           //@ts-ignore
  //           setDataNbeSupplier(data?.data.totalPurchases)
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
      className={`card bg-${color} hoverable d-md-flex flex-row justify-content-arround   ${className}`}
    >
      <div className='d-flex flex-row '>
        <div className='card-body'>
          <KTSVG path={svgIcon} className={`svg-icon-${iconColor} svg-icon-5x  text-warning `} />
        </div>
        <div className='mt-5'>
          <div className={`text-dark  fw-bold fs-5  mt-5`}> Achats : 15 produit</div>
          <div className={`text-dark  fw-bold fs-5  mt-5 `}>
            {/* <KTSVG
              path='/media/icons/duotune/user/dollar.svg'
              className={`svg-icon-1  text-dark`}
            /> */}
            Dépense : 150.000 DT
          </div>
        </div>
      </div>
    </p>
  )
}

export {TotalPurchase}
