import React, {useEffect, useState} from 'react'
import {Product} from './product-list/core/_models'
import {useNavigate, useParams} from 'react-router-dom'
import {getProductById, updateProduct} from './product-list/core/_requests'
import {useAuth} from '../../auth'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {useListView} from './product-list/core/ListViewProvider'
import {ProductListLoading} from './product-list/components/loading/ProductListLoading'
import clsx from 'clsx'
import {KTSVG, stringifyRequestQuery, toAbsoluteUrl} from '../../../../_metronic/helpers'
import {Item1} from '../../../../_metronic/partials/content/activity/Item1'
import {Item2} from '../../../../_metronic/partials/content/activity/Item2'
import {useQueryRequest} from './product-list/core/QueryRequestProvider'
import {getCategory} from '../category/category-list/core/_requests'

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
  console.log('🚀 ~ productData?.category?.id:', productData?.category?.id)
  console.log('🚀 ~ categoryId:', categoryId)
  const {state} = useQueryRequest()
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state))
  const [CategogyData, setCategogyData] = useState<any>()
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
    // console.log('🚀 ~ formik.values:', formik.values),
    <>
      <div className='d-flex flex-md-row flex-column'>
        <form
          id='kt_modal_add_user_form'
          className='   card   p-8 col-xs-12 col-md-7'
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
            <div className='fv-row mb-7'></div>
            <div className='fv-row mb-7'>
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
            <div className='mb-10'>
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
            {formik.touched.category_id && formik.errors.category_id && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.category_id}</span>
                </div>
              </div>
            )}
            <div className='fv-row mb-7'>
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
            <div className='fv-row mb-7'>
              <label className='required fw-bold fs-6 mb-2'>Quantité minimal</label>
              <input
                placeholder='Quantité minimal'
                {...formik.getFieldProps('minimalQuantity')}
                className={clsx(
                  'form-control form-control-solid mb-3 mb-lg-0',
                  {'is-invalid': formik.touched.minimalQuantity && formik.errors.minimalQuantity},
                  {
                    'is-valid': formik.touched.minimalQuantity && !formik.errors.minimalQuantity,
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
            <div className='fv-row mb-7'>
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

          <div className='text-center pt-15'>
            <button type='button' className='btn btn-secondary ' onClick={handleCancel}>
              Annuler
            </button>
            <button
              type='submit'
              className='btn btn-primary ms-2'
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
        <div className='card card-body mx-5 position-relative' id='kt_activities_body'>
          <h3 className='m-5 text-muted'>Rapport des appelles</h3>
          <div
            id='kt_activities_scroll'
            className='position-relative scroll-y me-n5 pe-5'
            data-kt-scroll='true'
            data-kt-scroll-height='auto'
            data-kt-scroll-wrappers='#kt_activities_body'
            data-kt-scroll-dependencies='#kt_activities_header, #kt_activities_footer'
            data-kt-scroll-offset='5px'
          >
            <div className='timeline'>
              <Item2 />
              <Item2 />
              <Item2 />
              <Item2 />
              <Item2 />
            </div>
          </div>
        </div>
      </div>

      {formik.isSubmitting && <ProductListLoading />}
    </>
  )
}

export default ProductView
