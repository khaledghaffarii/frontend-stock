import {FC, useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {isNotEmpty, toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import {Supplier} from '../core/_models'
import clsx from 'clsx'
import {useListView} from '../core/ListViewProvider'
import {SupplierListLoading} from '../components/loading/SupplierListLoading'
import {createSupplier, updateSupplier} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'
import {useAuth} from '../../../../auth'
type Props = {
  isUserLoading: boolean
  supplier: Supplier
}

const editSupplierSchema = Yup.object().shape({
  email: Yup.string()
    .email("Format d'email incorrect")
    .min(3, 'Minimum 3 caractères')
    .max(50, 'Maximum 50 caractères')
    .required("L'email est requis"),
  fullname: Yup.string()
    .min(3, 'Minimum 3 caractères')
    .max(25, 'Maximum 25 caractères')
    .required('Le nom est requis'),
  company: Yup.string()
    .min(3, 'Minimum 3 caractères')
    .max(25, 'Maximum 25 caractères')
    .required('Le nom est requis'),
  phone: Yup.string()
    .min(8, 'Minimum 8 caractères')
    .max(8, 'Maximum 8 caractères')
    .required('Le phone est requis'),
})

const SupplierEditModalForm: FC<Props> = ({supplier, isUserLoading}) => {
  const {setItemIdForUpdate} = useListView()
  const {refetch} = useQueryResponse()
  const {currentUser, auth} = useAuth()
  const token: any = auth?.token
  const [userForEdit] = useState<Supplier>({
    ...supplier,
    fullname: supplier.fullname,
    email: supplier.email,
    address: supplier.address,
    company: supplier.company,
    phone: supplier.phone,
    status: supplier.status,
  })
  const [error, setError] = useState<string | null>(null)
  console.log('🚀 ~ error:', error)

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }

  const formik = useFormik({
    initialValues: userForEdit,
    validationSchema: editSupplierSchema,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      setError(null)
      try {
        if (supplier) {
          await createSupplier(values, token)
          setTimeout(() => {
            setSubmitting(false)
            cancel(true)
          }, 2000)
        }
      } catch (ex: any) {
        if (ex.response) {
          if (ex.response.data.error.errorCode == 'DUPLICATE_SUPPLIER') {
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
            <h5 className='mb-1 '>Erreur lors de l'ajout du fournisseur</h5>
            <span className='fs-7 text-dark'>
              L'ajout du fournisseur a échoué en raison de duplications dans les champs. Veuillez
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
              {...formik.getFieldProps('fullname')}
              type='text'
              name='fullname'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.fullname && formik.errors.fullname},
                {
                  'is-valid': formik.touched.fullname && !formik.errors.fullname,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.fullname && formik.errors.fullname && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.fullname}</span>
                </div>
              </div>
            )}
          </div>
          <div className='fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>Email</label>
            <input
              placeholder='Email'
              {...formik.getFieldProps('email')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.email && formik.errors.email},
                {
                  'is-valid': formik.touched.email && !formik.errors.email,
                }
              )}
              type='email'
              name='email'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.email && formik.errors.email && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.email}</span>
                </div>
              </div>
            )}
          </div>
          <div className='fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>Company</label>
            <input
              placeholder='Company'
              {...formik.getFieldProps('company')}
              type='text'
              name='company'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.company && formik.errors.company},
                {
                  'is-valid': formik.touched.company && !formik.errors.company,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.company && formik.errors.company && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.company}</span>
                </div>
              </div>
            )}
          </div>
          <div className='fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>Adresse</label>
            <input
              placeholder='Adresse'
              {...formik.getFieldProps('address')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.address && formik.errors.address},
                {
                  'is-valid': formik.touched.address && !formik.errors.address,
                }
              )}
              type='address'
              name='address'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.address && formik.errors.address && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.address}</span>
              </div>
            )}
          </div>
          <div className='fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>Téléphone</label>
            <input
              placeholder='Téléphone'
              {...formik.getFieldProps('phone')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.phone && formik.errors.phone},
                {
                  'is-valid': formik.touched.phone && !formik.errors.phone,
                }
              )}
              type='phone'
              name='phone'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.phone && formik.errors.phone && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.phone}</span>
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
      {(formik.isSubmitting || isUserLoading) && <SupplierListLoading />}
    </>
  )
}

export {SupplierEditModalForm}
