import {FC, useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {isNotEmpty, stringifyRequestQuery, toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import {Achat} from '../core/_models'
import clsx from 'clsx'
import {useListView} from '../core/ListViewProvider'
import {AchatListLoading} from '../components/loading/AchatListLoading'
import {createAchat} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'
import {useAuth} from '../../../../auth'
import {getCategory} from '../../../category/category-list/core/_requests'
import {useQueryRequest} from '../core/QueryRequestProvider'
import {getSupplier} from '../../../supplier-management/users-list/core/_requests'
import {getProduct} from '../../../product-management/product-list/core/_requests'
type Props = {
  isUserLoading: boolean
  achat: Achat
}

const editAchatSchema = Yup.object().shape({
  quantity: Yup.string()
    .min(3, 'Minimum 3 caractères')
    .max(50, 'Maximum 50 caractères')
    .required("L'quantity est requis"),
  name: Yup.string()
    .min(3, 'Minimum 3 caractères')
    .max(25, 'Maximum 25 caractères')
    .required('Le nom est requis'),
  minimalQuantity: Yup.string()
    .min(3, 'Minimum 3 caractères')
    .max(25, 'Maximum 25 caractères')
    .required('Le nom est requis'),
  priceSale: Yup.string()
    .min(8, 'Minimum 8 caractères')
    .max(8, 'Maximum 8 caractères')
    .required('Le prix de vente est requis'),
  categoryId: Yup.string().required({id: 'categorie est requis'}),
})

const AchatEditModalForm: FC<Props> = ({achat, isUserLoading}) => {
  const {setItemIdForUpdate} = useListView()
  const {refetch} = useQueryResponse()
  const {currentUser, auth} = useAuth()
  const token: any = auth?.token
  const [categoryId, setCategoryId] = useState('')
  const {state} = useQueryRequest()
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state))
  const [CategogyData, setCategogyData] = useState<any>()
  const [ProductData, setProductData] = useState<any>()
  const [supplierData, setSupplierData] = useState<any>()
  const [userForEdit] = useState<Achat>({
    ...achat,
    product: achat?.product,
    product_id: achat?.product_id,
    supplier_id: achat?.supplier_id,
    quantity: achat?.quantity,
    unitPurchasePrice: achat?.unitPurchasePrice,
    totalPurchasePrice: achat?.totalPurchasePrice,
    createdAt: achat?.createdAt,
  })
  const [error, setError] = useState<string | null>(null)
  console.log('🚀 ~ error:', error)

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }
  useEffect(() => {
    try {
      const fetchData = async () => {
        try {
          const token: any = auth?.token
          const data = await getProduct(query, token)

          setProductData(data.data)
        } catch (error) {
          console.log('🚀 ~ file: GroupEditModalForm.tsx:43 ~ fetchData ~ error:', error)
          // Handle error
        }
      }
      fetchData()
    } catch (error) {}
  }, [])
  useEffect(() => {
    try {
      const fetchData = async () => {
        try {
          const token: any = auth?.token
          const data = await getSupplier(query, token)

          setSupplierData(data.data)
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
    validationSchema: editAchatSchema,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      setError(null)
      try {
        if (achat) {
          await createAchat(values, token)
          setTimeout(() => {
            setSubmitting(false)
            cancel(true)
          }, 2000)
        }
      } catch (ex: any) {
        if (ex.response) {
          if (
            ex.response.data.error.errorCode == 'DUPLICATE_CLIENT_NAME' ||
            ex.response.data.error.errorCode == 'DUPLICATE_PHONE' ||
            ex.response.data.error.errorCode == 'DUPLICATE_EMAIL'
          ) {
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
            <h5 className='mb-1 '>Erreur lors de l'ajout du Client</h5>
            <span className='fs-7 text-dark'>
              L'ajout du Client a échoué en raison de duplications dans les champs. Veuillez
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

          <div className='mb-10'>
            <label className='form-label fs-6 fw-bold'>Produit</label>
            <select
              {...formik.getFieldProps('product_id')}
              data-allow-clear='true'
              onChange={(e) => {
                // const product_Id = e.target.value
                // const selectedFormCategory = ProductData.find(
                //   (form: any) => form.id === product_Id
                // )
                // formik.setFieldValue('categoryId', e.target.value)

                formik.setFieldValue('product_id', e.target.value)
                setCategoryId(e.target.value)
              }}
              //onChange={(e) => setCategoryId(e.target.value)}
              id='product_id'
              name='product_id'
              value={categoryId}
              className={clsx(
                'form-select form-select-solid fw-bolder',
                {'is-invalid': formik.touched.product_id && formik.errors.product_id},
                {
                  'is-valid': formik.touched.product_id && !formik.errors.product_id,
                }
              )}
            >
              <option value='' disabled selected>
                choisi un produit
              </option>
              {ProductData &&
                ProductData.map((product: any) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
            </select>
          </div>
          {formik.touched.product_id && formik.errors.product_id && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.product_id}</span>
              </div>
            </div>
          )}
          <div className='mb-10'>
            <label className='form-label fs-6 fw-bold'>Fournisseur</label>
            <select
              {...formik.getFieldProps('product_id')}
              data-allow-clear='true'
              onChange={(e) => {
                // const product_Id = e.target.value
                // const selectedFormCategory = CategogyData.find(
                //   (form: any) => form.id === product_Id
                // )
                // formik.setFieldValue('categoryId', e.target.value)

                formik.setFieldValue('supplier_id', e.target.value)
                setCategoryId(e.target.value)
              }}
              //onChange={(e) => setCategoryId(e.target.value)}
              id='supplier_id'
              name='supplier_id'
              value={categoryId}
              className={clsx(
                'form-select form-select-solid fw-bolder',
                {'is-invalid': formik.touched.supplier_id && formik.errors.supplier_id},
                {
                  'is-valid': formik.touched.supplier_id && !formik.errors.supplier_id,
                }
              )}
            >
              <option value='' disabled selected>
                choisi un produit
              </option>
              {supplierData &&
                supplierData.map((supplier: any) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
            </select>
          </div>
          {formik.touched.supplier_id && formik.errors.supplier_id && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.supplier_id}</span>
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
            <label className='required fw-bold fs-6 mb-2'>Prix unitaire</label>
            <input
              placeholder='Prix unitaire'
              {...formik.getFieldProps('unitPurchasePrice')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {
                  'is-invalid': formik.touched.unitPurchasePrice && formik.errors.unitPurchasePrice,
                },
                {
                  'is-valid': formik.touched.unitPurchasePrice && !formik.errors.unitPurchasePrice,
                }
              )}
              type='unitPurchasePrice'
              name='unitPurchasePrice'
              autoComplete='off'
              disabled={formik.isSubmitting}
            />
            {formik.touched.unitPurchasePrice && formik.errors.unitPurchasePrice && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.unitPurchasePrice}</span>
              </div>
            )}
          </div>
          <div className='fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>Prix total</label>
            <input
              placeholder='Prix total'
              {...formik.getFieldProps('totalPurchasePrice')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {
                  'is-invalid':
                    formik.touched.totalPurchasePrice && formik.errors.totalPurchasePrice,
                },
                {
                  'is-valid':
                    formik.touched.totalPurchasePrice && !formik.errors.totalPurchasePrice,
                }
              )}
              type='number'
              name='totalPurchasePrice'
              autoComplete='off'
              disabled={formik.isSubmitting}
            />
            {formik.touched.totalPurchasePrice && formik.errors.totalPurchasePrice && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.totalPurchasePrice}</span>
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
      {(formik.isSubmitting || isUserLoading) && <AchatListLoading />}
    </>
  )
}

export {AchatEditModalForm}
