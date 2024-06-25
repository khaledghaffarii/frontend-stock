import {FC, useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {isNotEmpty, toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import {Category} from '../core/_models'
import clsx from 'clsx'
import {useListView} from '../core/ListViewProvider'
import {CategoryListLoading} from '../components/loading/CategoryListLoading'
import {createCategory} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'
import {useAuth} from '../../../../auth'
type Props = {
  isUserLoading: boolean
  category: Category
}

const editCategorySchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Minimum 3 caractères')
    .max(25, 'Maximum 25 caractères')
    .required('Le nom est requis'),
})

const CategoryEditModalForm: FC<Props> = ({category, isUserLoading}) => {
  const {setItemIdForUpdate} = useListView()
  const {refetch} = useQueryResponse()
  const {currentUser, auth} = useAuth()
  const token: any = auth?.token
  const [userForEdit] = useState<Category>({
    ...category,
    name: category.name,
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
    validationSchema: editCategorySchema,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      setError(null)
      try {
        if (category) {
          await createCategory(values, token)
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
      {(formik.isSubmitting || isUserLoading) && <CategoryListLoading />}
    </>
  )
}

export {CategoryEditModalForm}
