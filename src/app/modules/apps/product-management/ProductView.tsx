import React, {useEffect, useState} from 'react'
import {Product} from './product-list/core/_models'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {getProductById, updateProduct} from './product-list/core/_requests'
import {useAuth} from '../../auth'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {useListView} from './product-list/core/ListViewProvider'
import {ProductListLoading} from './product-list/components/loading/ProductListLoading'
import clsx from 'clsx'
import {KTCard, KTSVG, stringifyRequestQuery, toAbsoluteUrl} from '../../../../_metronic/helpers'
import {Item1} from '../../../../_metronic/partials/content/activity/Item1'
import {Item2} from '../../../../_metronic/partials/content/activity/Item2'
import {useQueryRequest} from './product-list/core/QueryRequestProvider'
import {getCategory} from '../category/category-list/core/_requests'
import {Container, Row, Col, Image, Badge} from 'react-bootstrap'
import {ProductTable} from './product-list/table/ProductTable'
import ProductRapportView from './ProductRapportView'

type Props = {
  className: string
  product: Product | undefined
}

const ProductView: React.FC<Props> = ({className, product}) => {
  const {id} = useParams<{id: any}>()
  const {auth} = useAuth()
  const [productData, setProductData] = useState<Product | null>(null)
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)
  const navigate = useNavigate()
  const {setItemIdForUpdate} = useListView()
  const [categoryId, setCategoryId] = useState<any>('')
  console.log('🚀 ~ productData?.', productData)
  console.log('🚀 ~ categoryId:', categoryId)
  const {state} = useQueryRequest()
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state))
  const [CategogyData, setCategogyData] = useState<any>()
  const [activeTab, setActiveTab] = useState<string>('overview')
  const [productName, setProductName] = useState<string>('')

  const [productCategoryName, setProductCategoryName] = useState<string>('')
  const [productPriceSale, setProductPriceSale] = useState<Number>(0)
  const [productQuantity, setProductQuantity] = useState<string>('')
  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
  }

  const tabStyle = {
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    color: '#6c757d',
  }

  const activeTabStyle = {
    ...tabStyle,
    color: '#007bff',
    borderBottom: '2px solid #007bff',
  }

  const containerStyles = {
    display: 'flex',
    borderBottom: '1px solid #dee2e6',
  }
  const cardStyle: React.CSSProperties = {
    flex: '1',
    margin: '0 10px',
    backgroundColor: '#f8f9fa',
    border: 'none',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  }

  const cardTitleStyle: React.CSSProperties = {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#6c757d',
  }

  const cardTextStyle: React.CSSProperties = {
    margin: '0',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#212529',
  }

  const subTextStyle: React.CSSProperties = {
    fontSize: '0.75rem',
  }

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px',
  }

  useEffect(() => {
    formik.setFieldValue('categoryId', categoryId)
    setCategoryId(productData?.category?.id)
  }, [productData?.category?.id])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = auth?.token
        if (token) {
          const data = await getProductById(id, token)

          //@ts-ignore
          setProductData(data?.data)
          //@ts-ignore
          setProductName(data?.data.name)
          //@ts-ignore
          setProductPriceSale(data?.data.quantity)
          //@ts-ignore
          setProductQuantity(data?.data.quantity)
          //@ts-ignore
          setProductCategoryName(data?.data?.category?.name)
        }
      } catch (error) {
        console.log('🚀 ~ fetchData ~ error:', error)
      }
    }
    fetchData()
  }, [id, auth])
  useEffect(() => {
    try {
      const fetchData = async () => {
        try {
          const token: any = auth?.token
          const data = await getCategory(query, token)

          setCategogyData(data.data)
        } catch (error) {
          console.log('🚀 ~ file: GroupEditModalForm.tsx:43 ~ fetchData ~ error:', error)
          // Handle error
        }
      }
      fetchData()
    } catch (error) {}
  }, [])
  const editClientSchema = Yup.object().shape({
    quantity: Yup.number()
      .min(1, 'Minimum 1 caractères')

      .required("L'quantity est requis"),
    name: Yup.string()
      .min(3, 'Minimum 3 caractères')
      .max(50, 'Maximum 25 caractères')
      .required('Le nom est requis'),
    minimalQuantity: Yup.number().min(1, 'Minimum 1 caractères').required('Le nom est requis'),
    priceSale: Yup.number().min(1, 'Minimum 1 caractères').required('Le prix de vente est requis'),
    //categoryId: Yup.string().required({id: 'categorie est requis'}),
  })

  const formik = useFormik({
    initialValues: {
      name: productData?.name,
      category_id: productData?.category_id,
      quantity: productData?.quantity,
      minimalQuantity: productData?.minimalQuantity,
      priceSale: productData?.priceSale,
      createdAt: productData?.createdAt,
    },
    enableReinitialize: true,
    validationSchema: editClientSchema,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      setHasErrors(undefined)
      try {
        const token = auth?.token
        if (token) {
          await updateProduct(id, values, token)
          navigate(`/apps/product-management/product`)
          setHasErrors(false)
          setItemIdForUpdate(null)
        }
      } catch (ex: any) {
        console.error(ex)
        setHasErrors(true)
      } finally {
        setSubmitting(false)
      }
    },
  })
  // console.log('🚀 ~ categoryId: 113', formik.values?.category_id)
  // console.log('🚀 ~ formik.values:', formik.values)
  if (!productData) {
    return <ProductListLoading />
  }
  const handleCancel = () => {
    navigate(-1)
  }
  return (
    <div className=''>
      <div className=' mt-4  w-100 mb-16'>
        <div className='d-flex align-items-center p-3 mb-3 bg-light rounded'>
          <div className='me-3'>
            <div className='badge bg-primary '>Matériel</div>
            <div
              className='d-flex align-items-center justify-content-center bg-light text-primary rounded'
              style={{height: '150px', width: '150px'}}
            >
              <img
                src='/media/icons/duotune/user/default.png'
                alt='Icon'
                style={{maxWidth: '100%', maxHeight: '100%'}}
              />
            </div>
          </div>
          <div>
            <h4>{productName && productName}</h4>
            <div>
              <span className='text-muted'>Marque :</span> Marque générale
              <span className='ms-3 text-muted'>Catégorie :</span>{' '}
              {productCategoryName && productCategoryName}
            </div>
            <div className='d-flex  justify-content-between  ' style={{width: '160vh'}}>
              {' '}
              <div className='d-flex mt-2 align-items-center '>
                <div className='me-3 text-center p-3 border'>
                  <div className='text-muted'>P-00001</div>
                  <div className='text-primary'>Référence interne</div>
                </div>
                <div className='me-3 text-center p-3 border'>
                  <div className='text-muted'>
                    {productPriceSale && productPriceSale?.toFixed(3)} TND
                  </div>
                  <div className='text-primary'>Prix public</div>
                </div>
                <div className='text-center p-3 border'>
                  <div className='text-muted'>19 %</div>
                  <div className='text-primary'>TVA</div>
                </div>
              </div>
              <div className='ms-auto text-center p-3 border'>
                <div className='text-muted fw-bold fs-3'>
                  {' '}
                  {productQuantity && productQuantity}{' '}
                </div>
                <div className='badge bg-success m-3'>En stock</div>
              </div>
            </div>
          </div>
        </div>

        <div className=' mt-4 mb-4'>
          <div className=' mt-4 mb-4' style={containerStyles}>
            <div
              style={activeTab === 'overview' ? activeTabStyle : tabStyle}
              onClick={() => handleTabClick('overview')}
              className='fs-3'
            >
              Vue d'ensemble
            </div>
            <div
              style={activeTab === 'stockMovement' ? activeTabStyle : tabStyle}
              onClick={() => handleTabClick('stockMovement')}
              className='fs-3'
            >
              Mouvement de stock
            </div>
          </div>
          {activeTab === 'overview' && (
            <div className='d-flex  flex-column w-100'>
              <div className='d-flex justify-content-between mt-3'>
                <div
                  className='card p-3 bg-white'
                  style={{
                    flex: '1',
                    margin: '0 10px',
                    backgroundColor: '#f8f9fa',
                    border: 'none',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <div className='card-body'>
                    <h6 className='card-title text-muted'>Prix public</h6>
                    <p
                      className='card-text'
                      style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#212529'}}
                    >
                      1785,000 TND <span style={{fontSize: '0.75rem'}}>TTC</span>
                    </p>
                    <p className='card-text text-muted' style={{fontSize: '1rem'}}>
                      1500,000 TND <span style={{fontSize: '0.75rem'}}>HT</span>
                    </p>
                  </div>
                </div>
                <div
                  className='card p-3 bg-white'
                  style={{
                    flex: '1',
                    margin: '0 10px',
                    backgroundColor: '#f8f9fa',
                    border: 'none',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <div className='card-body'>
                    <h6 className='card-title text-muted'>TVA</h6>
                    <p
                      className='card-text'
                      style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#212529'}}
                    >
                      19 %
                    </p>
                  </div>
                </div>
                <div
                  className='card p-3 bg-white'
                  style={{
                    flex: '1',
                    margin: '0 10px',
                    backgroundColor: '#f8f9fa',
                    border: 'none',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <div className='card-body'>
                    <h6 className='card-title text-muted'>Dernier prix d'achat</h6>
                    <p
                      className='card-text'
                      style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#212529'}}
                    >
                      0,000 TND
                    </p>
                  </div>
                </div>
                <div
                  className='card p-3 bg-white'
                  style={{
                    flex: '1',
                    margin: '0 10px',
                    backgroundColor: '#f8f9fa',
                    border: 'none',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <div className='card-body'>
                    <h6 className='card-title text-muted'>Valeur unitaire en stock</h6>
                    <p
                      className='card-text'
                      style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#212529'}}
                    >
                      0,000 TND
                    </p>
                  </div>
                </div>
              </div>
              <div className='d-flex flex-row mt-3'>
                <form
                  id='kt_modal_add_user_form'
                  className='   card   p-8 col-xs-12 col-md-5'
                  onSubmit={formik.handleSubmit}
                  noValidate
                >
                  <div
                    className='d-flex flex-column scroll-y me-n7 pe-7'
                    id='kt_modal_add_user_scroll'
                    data-kt-scroll='true'
                    data-kt-scroll-activate='{default: false, lg: true}'
                    data-kt-scroll-max-height='auto'
                    data-kt-scroll-dependencies='#kt_modal_add_user_header'
                    data-kt-scroll-wrappers='#kt_modal_add_user_scroll'
                    data-kt-scroll-offset='300px'
                  >
                    <div className='d-flex flex-row  fw-bold'>
                      <div className='fv-row mb-7 mx-5 w-25'>
                        <label className='required fw-bold fs-6 mb-2'>Nom Complet</label>
                        <input
                          placeholder='Nom complet'
                          {...formik.getFieldProps('name')}
                          type='text'
                          name='name'
                          className={clsx(
                            'form-control form-control-solid mb-3 mb-lg-0',
                            {'is-invalid': formik.touched.name && formik.errors.name},
                            {
                              'is-valid': formik.touched.name && !formik.errors.name,
                            }
                          )}
                          autoComplete='off'
                          disabled={formik.isSubmitting}
                        />
                        {formik.touched.name && formik.errors.name && (
                          <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>
                              <span role='alert'>{formik.errors.name}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className='mb-10 mx-5 w-25'>
                        <label className='form-label fs-6 fw-bold'>Categories</label>
                        <select
                          {...formik.getFieldProps('categoryId')}
                          data-allow-clear='true'
                          onChange={(e) => {
                            // const category_Id = e.target.value
                            // const selectedFormCategory = CategogyData.find(
                            //   (form: any) => form.id === category_Id
                            // )
                            // formik.setFieldValue('categoryId', e.target.value)

                            formik.setFieldValue('category_id', e.target.value)
                            setCategoryId(e.target.value)
                          }}
                          //onChange={(e) => setCategoryId(e.target.value)}
                          id='categoryId'
                          name='categoryId'
                          value={categoryId}
                          className={clsx(
                            'form-select form-select-solid fw-bolder',
                            {'is-invalid': formik.touched.category_id && formik.errors.category_id},
                            {
                              'is-valid': formik.touched.category_id && !formik.errors.category_id,
                            }
                          )}
                        >
                          <option value='' disabled selected>
                            choisi une categorie
                          </option>
                          {CategogyData &&
                            CategogyData.map((category: any) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>

                    {formik.touched.category_id && formik.errors.category_id && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>
                          <span role='alert'>{formik.errors.category_id}</span>
                        </div>
                      </div>
                    )}

                    <div className='fv-row mb-7 mx-5 w-75'>
                      <label className='required fw-bold fs-6 mb-2'>Quantité</label>
                      <input
                        placeholder='Quantité'
                        {...formik.getFieldProps('quantity')}
                        type='number'
                        name='quantity'
                        className={clsx(
                          'form-control form-control-solid mb-3 mb-lg-0',
                          {'is-invalid': formik.touched.quantity && formik.errors.quantity},
                          {
                            'is-valid': formik.touched.quantity && !formik.errors.quantity,
                          }
                        )}
                        autoComplete='off'
                        disabled={formik.isSubmitting}
                      />
                      {formik.touched.quantity && formik.errors.quantity && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>
                            <span role='alert'>{formik.errors.quantity}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className='fv-row mb-7 mx-5 w-75'>
                      <label className='required fw-bold fs-6 mb-2'>Quantité minimal</label>
                      <input
                        placeholder='Quantité minimal'
                        {...formik.getFieldProps('minimalQuantity')}
                        className={clsx(
                          'form-control form-control-solid mb-3 mb-lg-0',
                          {
                            'is-invalid':
                              formik.touched.minimalQuantity && formik.errors.minimalQuantity,
                          },
                          {
                            'is-valid':
                              formik.touched.minimalQuantity && !formik.errors.minimalQuantity,
                          }
                        )}
                        type='minimalQuantity'
                        name='minimalQuantity'
                        autoComplete='off'
                        disabled={formik.isSubmitting}
                      />
                      {formik.touched.minimalQuantity && formik.errors.minimalQuantity && (
                        <div className='fv-plugins-message-container'>
                          <span role='alert'>{formik.errors.minimalQuantity}</span>
                        </div>
                      )}
                    </div>
                    <div className='fv-row mb-7 mx-5 w-75'>
                      <label className='required fw-bold fs-6 mb-2'>Prix de vente</label>
                      <input
                        placeholder='Prix de vente'
                        {...formik.getFieldProps('priceSale')}
                        className={clsx(
                          'form-control form-control-solid mb-3 mb-lg-0',
                          {'is-invalid': formik.touched.priceSale && formik.errors.priceSale},
                          {
                            'is-valid': formik.touched.priceSale && !formik.errors.priceSale,
                          }
                        )}
                        type='number'
                        name='priceSale'
                        autoComplete='off'
                        disabled={formik.isSubmitting}
                      />
                      {formik.touched.priceSale && formik.errors.priceSale && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>
                            <span role='alert'>{formik.errors.priceSale}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='text-start pt-15'>
                    <button
                      type='button'
                      className='btn btn-secondary mx-5 '
                      onClick={handleCancel}
                    >
                      Annuler
                    </button>
                    <button
                      type='submit'
                      className='btn btn-primary  mx-5'
                      data-kt-users-modal-action='submit'
                      disabled={formik.isSubmitting || !formik.isValid || !formik.touched}
                    >
                      <span className='indicator-label'>Soumettre</span>
                      {formik.isSubmitting && (
                        <span className='indicator-progress'>
                          Veuillez patienter...{' '}
                          <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                        </span>
                      )}
                    </button>
                  </div>
                  {/* end::Actions */}
                </form>
                <div className='card col-5 mx-5'>
                  <div className='card-body'>
                    <h5 className='card-title'>Informations sur le produit</h5>
                    <ul className='list-group list-group-flush'>
                      <li className='list-group-item'>
                        <strong>Type</strong>
                        <div> Matériel</div>
                      </li>
                      <li className='list-group-item'>
                        <strong>Marque</strong>
                        <div>Marque générale</div>
                      </li>
                      <li className='list-group-item'>
                        <strong>Unité</strong>
                        <div>kilogramme</div>
                      </li>
                      <li className='list-group-item'>
                        <strong>Référence interne</strong>
                        <div>--</div>
                      </li>
                      <li className='list-group-item'>
                        <strong>Référence fabricant</strong>
                        <div>--</div>
                      </li>
                      <li className='list-group-item'>
                        <strong>Description</strong>
                        <div>--</div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'stockMovement' && <ProductRapportView id={id} />}
        </div>
      </div>
    </div>
  )
}

export default ProductView
