import React, {useEffect, useState} from 'react'
import {Sale} from './sale-list/core/_models'
import {useNavigate, useParams} from 'react-router-dom'
import {getSaleById} from './sale-list/core/_requests'
import {useAuth} from '../../auth'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {useListView} from './sale-list/core/ListViewProvider'
import {SaleListLoading} from './sale-list/components/loading/SaleListLoading'
import clsx from 'clsx'
import {KTSVG, stringifyRequestQuery, toAbsoluteUrl} from '../../../../_metronic/helpers'
import {Item1} from '../../../../_metronic/partials/content/activity/Item1'
import {Item2} from '../../../../_metronic/partials/content/activity/Item2'
import {useQueryRequest} from './sale-list/core/QueryRequestProvider'
import {getCategory} from '../category/category-list/core/_requests'
import {getSupplier} from '../supplier-management/users-list/core/_requests'
import {getProduct} from '../product-management/product-list/core/_requests'
import moment from 'moment'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import html2canvas from 'html2canvas'

type Props = {
  className: string
  sale: Sale | undefined
}

const SaleView: React.FC<Props> = ({className, sale}) => {
  const {id} = useParams<{id: any}>()
  const {auth} = useAuth()
  const [saleData, setSaleData] = useState<any>('')
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)
  const navigate = useNavigate()
  const {setItemIdForUpdate} = useListView()
  const [supplierId, setSupplierId] = useState<any>('')
  const [productId, setProductId] = useState<any>('')
  const {state} = useQueryRequest()
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state))

  const tva = saleData?.tva
  const totalHT = (saleData?.totalSalePrice - 1) / (1 + tva / 100)
  const totalTTC = saleData?.totalSalePrice - 1
  const netAPayer = saleData?.totalSalePrice
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = auth?.token
        if (token) {
          const data = await getSaleById(id, token)

          //@ts-ignore
          setSaleData(data?.data)
        }
      } catch (error) {
        console.log('🚀 ~ fetchData ~ error:', error)
      }
    }
    fetchData()
  }, [id, auth])

  if (!saleData) {
    return <SaleListLoading />
  }
  const handleCancel = () => {
    navigate(-1)
  }

  const handleExportPDF = async () => {
    const input = document.getElementById('pdf-content')
    if (input) {
      const canvas = await html2canvas(input)
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF()
      //@ts-ignore
      pdf.addImage(imgData, 'PNG', 0, 0)
      pdf.save(`Achat_${saleData?.numInvoice}.pdf`)
    }
  }
  return (
    <>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='card'>
              <div className='card-body'>
                <div className='invoice-title'>
                  <h4 className='mb-5'>vente Facturé</h4>
                  <h4 className='float-end' style={{fontSize: '15px'}}>
                    {saleData?.refInvoice}
                    <span
                      className='badge bg-success'
                      style={{fontSize: '12px', marginLeft: '8px'}}
                    >
                      Payé
                    </span>
                  </h4>
                  <div className='mb-4'>
                    <h2 className='mb-1 text-muted'>{saleData?.client?.company}</h2>
                  </div>
                  <div className='text-muted'>
                    <p className='mb-1'>{saleData?.client?.fullname}</p>
                    <p className='mb-1'>{saleData?.client?.address}</p>
                    <p className='mb-1'>
                      <i className='uil uil-envelope-alt '></i> {saleData?.client?.email}
                    </p>
                    <p>
                      <i className='uil uil-phone '></i> {saleData?.client?.phone}
                    </p>
                  </div>
                </div>

                <hr className='my-4' />

                <div className='row'>
                  <div className='col-sm-6'></div>
                  <div className='col-12'>
                    <div className='text-muted text-sm-start mb-12 mt-8'>
                      <div className='d-flex w-25 flex-row justify-content-between'>
                        <h5 style={{fontSize: '15px', marginBottom: '8px'}}>Numéro de vente :</h5>
                        <p className='text-dark'>#{saleData?.numInvoice}</p>
                      </div>
                      <div
                        className='d-flex w-25 flex-row justify-content-between'
                        style={{marginTop: '16px'}}
                      >
                        <h5 style={{fontSize: '15px', marginBottom: '8px'}}>Date de vente :</h5>
                        <p className='text-dark'>
                          {' '}
                          {moment(saleData.saleDate).format('DD MMMM YYYY, HH:mm')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='py-2'>
                  <h5 style={{fontSize: '15px', marginBottom: 35}}>Résumé de la vente</h5>

                  <div className='table-responsive'>
                    <table className='table table-invoice'>
                      <thead>
                        <tr>
                          <th style={{width: '70px'}} className='fw-bold '>
                            No.
                          </th>
                          <th className='fw-bold '>Désignation</th>
                          <th className='fw-bold '>Prix unitaire HT</th>
                          <th className='fw-bold '>Quantité</th>
                          <th className='fw-bold text-end' style={{width: '120px'}}>
                            Prix total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope='row'>01</th>
                          <td>
                            <div>
                              <p
                                onClick={() => {
                                  navigate(
                                    `/apps/product-management/product/view/${saleData?.product?.id}`
                                  )
                                }}
                                className='text-primary'
                                style={{fontSize: '14px', marginBottom: '8px', cursor: 'pointer'}}
                              >
                                {saleData?.product?.name}
                              </p>
                              {/* <p className='text-muted mb-0'> {saleData?.categoryProduct?.name}</p> */}
                            </div>
                          </td>
                          <td>{saleData?.product.priceSale} TND</td>
                          <td>{saleData?.quantity}</td>
                          <td className='text-end'>{totalHT?.toFixed(3)} TND</td>
                        </tr>
                      </tbody>
                    </table>
                    <hr></hr>
                    <div className='mt-5 table-responsive'>
                      <table className='table table-striped table-borderless border-0 border-b-2 brc-default-l1 w-25'>
                        <tbody>
                          <tr>
                            <th scope='row' className='fw-bold text-start'>
                              Total HT
                            </th>
                            <td className='text-end'>{totalHT?.toFixed(3)} TND</td>
                          </tr>
                          <tr>
                            <th scope='row' className='fw-bold text-start'>
                              TVA :
                            </th>
                            <td className='text-end'>{tva}%</td>
                          </tr>
                          <tr>
                            <th scope='row' className='fw-bold text-start'>
                              Total TTC :
                            </th>
                            <td className='text-end'>{totalTTC.toFixed(3)} TND</td>
                          </tr>
                          <tr>
                            <th scope='row' className='fw-bold text-start'>
                              Timbre fiscal
                            </th>
                            <td className='text-end'>1,000 TND</td>
                          </tr>
                          <tr>
                            <th scope='row' className='fw-bold text-start'>
                              Net à payer
                            </th>
                            <td className='text-end'>
                              <h4 className='m-0 fw-semibold'>{netAPayer.toFixed(3)} TND</h4>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className='w-100 mt-4 d-flex justify-content-center m-5'>
                    <div className='d-flex gap-2'>
                      <button onClick={() => navigate(-1)} className='btn btn-secondary'>
                        Retour
                      </button>
                      <button onClick={() => handleExportPDF()} className='btn btn-success'>
                        <i className='bi bi-file-pdf'></i> exporter PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SaleView
