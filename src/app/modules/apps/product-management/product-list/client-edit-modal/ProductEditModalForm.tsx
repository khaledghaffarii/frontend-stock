import {FC, useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {isNotEmpty, stringifyRequestQuery, toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import {Product} from '../core/_models'
import clsx from 'clsx'
import {useListView} from '../core/ListViewProvider'
import {ProductListLoading} from '../components/loading/ProductListLoading'
import {createProduct} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'
import {useAuth} from '../../../../auth'
import {getCategory} from '../../../category/category-list/core/_requests'
import {useQueryRequest} from '../core/QueryRequestProvider'
type Props = {
  isUserLoading: boolean
  product: Product
}

const editProductSchema = Yup.object().shape({
  quantity: Yup.string()

    .max(50, 'Maximum 50 caractères')
    .required("L'quantity est requis"),
  name: Yup.string()
    .min(3, 'Minimum 3 caractères')
    .max(25, 'Maximum 25 caractères')
    .required('Le nom est requis'),
  minimalQuantity: Yup.string().max(25, 'Maximum 25 caractères').required('Le nom est requis'),
  priceSale: Yup.string().max(20, 'Maximum 8 caractères').required('Le prix de vente est requis'),
  categoryId: Yup.string().required({id: 'categorie est requis'}),
})

const ProductEditModalForm: FC<Props> = ({product, isUserLoading}) => {
  const {setItemIdForUpdate} = useListView()
  const {refetch} = useQueryResponse()
  const {currentUser, auth} = useAuth()
  const token: any = auth?.token
  const [categoryId, setCategoryId] = useState('')
  const {state} = useQueryRequest()
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state))
  const [CategogyData, setCategogyData] = useState<any>()

  const [userForEdit] = useState<Product>({
    ...product,
    name: product.name,
    category_id: product?.category_id,
    quantity: product.quantity,
    minimalQuantity: product.minimalQuantity,
    priceSale: product.priceSale,
  })
  const [error, setError] = useState<string | null>(null)
  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }
  useEffect(() => {
    formik.setFieldValue('category_id', categoryId)
  }, [categoryId])

  useEffect(() => {
    try {
      const fetchData = async () => {
        try {
          const token: any = auth?.token
          const data = await getCategory(query, token)
          console.log('🚀 ~ fetchData ~ data:', data)

          setCategogyData(data?.data)
        } catch (error) {
          console.log('🚀 ~ file: GroupEditModalForm.tsx:43 ~ fetchData ~ error:', error)
          // Handle error
        }
      }
      fetchData()
    } catch (error) {}
  }, [])
  const formik = useFormik({
    initialValues: userForEdit,
    validationSchema: editProductSchema,
    onSubmit: async (values, {setSubmitting}) => {
      console.log('🚀 ~ onSubmit: ~ values:', values)
      setSubmitting(true)
      setError(null)
      try {
        if (product) {
          const data = await createProduct(values, token)
          console.log('🚀 ~ onSubmit: ~ data:', data)
          setTimeout(() => {
            setSubmitting(false)
            cancel(true)
          }, 2000)
        }
      } catch (ex: any) {
        if (ex.response) {
          if (ex.response.data.error.errorCode == 'DUPLICATE_PRODUCT_NAME') {
            setError(ex.response.data.error.message)
          }
        } else {
          setError('An unknown error occurred')
        }
      } finally {
        setSubmitting(false)
      }
    },
  })

  useEffect(() => {
    if (error) {
      console.log('🚀 ~ error xxx:', error)
    }
  }, [error])
  return (
    <>
      {error && (
        <div className='alert alert-dismissible bg-light-danger d-flex flex-column flex-sm-row p-5 mb-10'>
          <span className='svg-icon svg-icon-2hx svg-icon-primary me-4 mb-5 mb-sm-0'>
            <i className='bi bi-exclamation-circle text-danger fs-3'></i>
          </span>
          <div className='d-flex flex-column text-primary pe-0 pe-sm-10'>
            <h5 className='mb-1 '>Erreur lors de l'ajout du Product</h5>
            <span className='fs-7 text-dark'>
              L'ajout du Product a échoué en raison de duplications dans les champs. Veuillez
              vérifier les informations saisies. email, ce nom complet ou numéro de téléphone existe
              déjà .
            </span>
          </div>

          <button
            type='button'
            className='position-absolute position-sm-relative m-2 m-sm-0 top-0 end-0 btn btn-icon ms-sm-auto'
            data-bs-dismiss='alert'
          >
            <span className='svg-icon svg-icon-1 svg-icon-primary'>...</span>
          </button>
        </div>
      )}

      <form id='kt_modal_add_user_form' className='form' onSubmit={formik.handleSubmit} noValidate>
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
              disabled={formik.isSubmitting || isUserLoading}
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
                formik.setFieldValue('category_id', e.target.value)
                formik.setFieldValue('categoryId', e.target.value)
                setCategoryId(e.target.value)
              }}
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
              disabled={formik.isSubmitting || isUserLoading}
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
              type='number'
              name='minimalQuantity'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
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
              disabled={formik.isSubmitting || isUserLoading}
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
          <button
            type='reset'
            onClick={() => cancel()}
            className='btn btn-light me-3'
            data-kt-users-modal-action='cancel'
            disabled={formik.isSubmitting || isUserLoading}
          >
            Annuler
          </button>

          <button
            type='submit'
            className='btn btn-primary'
            data-kt-users-modal-action='submit'
            disabled={isUserLoading || formik.isSubmitting || !formik.isValid || !formik.touched}
          >
            <span className='indicator-label'>Soumettre</span>
            {(formik.isSubmitting || isUserLoading) && (
              <span className='indicator-progress'>
                Veuillez patienter...{' '}
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>
      </form>
      {(formik.isSubmitting || isUserLoading) && <ProductListLoading />}
    </>
  )
}

export {ProductEditModalForm}
