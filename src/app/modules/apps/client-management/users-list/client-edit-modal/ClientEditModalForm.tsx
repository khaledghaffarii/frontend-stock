import {FC, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {isNotEmpty, toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import {Client} from '../core/_models'
import clsx from 'clsx'
import {useListView} from '../core/ListViewProvider'
import {ClientListLoading} from '../components/loading/ClientListLoading'
import {createClient, updateClient} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'
import {useAuth} from '../../../../auth'

type Props = {
  isUserLoading: boolean
  client: Client
}

const editUserSchema = Yup.object().shape({
  email: Yup.string()
    .email("Format d'email incorrect")
    .min(3, 'Minimum 3 caractères')
    .max(50, 'Maximum 50 caractères')
    .required("L'email est requis"),
  fullname: Yup.string()
    .min(3, 'Minimum 3 caractères')
    .max(25, 'Maximum 25 caractères')
    .required('Le nom est requis'),
  status: Yup.string()
    .oneOf(['vendu', 'annulé', 'en attente', 'reporter'], 'Statut invalide')
    .required('Le statut est requis'),
  telephone: Yup.string()
    .min(8, 'Minimum 8 caractères')
    .max(8, 'Maximum 8 caractères')
    .required('Le telephone est requis'),
})

const ClientEditModalForm: FC<Props> = ({client, isUserLoading}) => {
  const {setItemIdForUpdate} = useListView()
  const {refetch} = useQueryResponse()
  const {currentUser, auth} = useAuth()
  //@ts-ignore
  const token: string = auth?.token
  const [userForEdit] = useState<Client>({
    ...client,
    fullname: client.fullname,
    email: client.email,
    address: client.address,
    telephone: client.telephone,
    status: client.status,
  })

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }

  const blankImg = toAbsoluteUrl('/media/svg/avatars/blank.svg')
  // const userAvatarImg = toAbsoluteUrl(`/media/${userForEdit.avatar}`)

  const formik = useFormik({
    initialValues: userForEdit,
    validationSchema: editUserSchema,
    onSubmit: async (values, {setSubmitting}) => {
      console.log('🚀 ~ onSubmit: ~ values:', values)
      setSubmitting(true)
      try {
        if (client) {
          await createClient(values, token)
          setTimeout(() => {
            setSubmitting(false)
            cancel(true)
          }, 2000)
        }
      } catch (ex) {
        console.error(ex)
      } finally {
        setSubmitting(false)
        cancel(true)
      }
    },
  })

  return (
    <>
      <form id='kt_modal_add_user_form' className='form' onSubmit={formik.handleSubmit} noValidate>
        {/* begin::Scroll */}
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
            {/* end::Input */}
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
              {...formik.getFieldProps('telephone')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.telephone && formik.errors.telephone},
                {
                  'is-valid': formik.touched.telephone && !formik.errors.telephone,
                }
              )}
              type='telephone'
              name='telephone'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.telephone && formik.errors.telephone && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.telephone}</span>
                </div>
              </div>
            )}
          </div>
          <div className='fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>Statut</label>
            <select
              {...formik.getFieldProps('status')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.status && formik.errors.status},
                {
                  'is-valid': formik.touched.status && !formik.errors.status,
                }
              )}
              name='status'
              disabled={formik.isSubmitting || isUserLoading}
            >
              <option value=''>Sélectionnez un statut</option>
              <option value='vendu'>Vendu</option>
              <option value='annulé'>Annulé</option>
              <option value='en attente'>En attente</option>
              <option value='reporter'>Reporter</option>
            </select>
            {formik.touched.status && formik.errors.status && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.status}</span>
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
        {/* end::Actions */}
      </form>
      {(formik.isSubmitting || isUserLoading) && <ClientListLoading />}
    </>
  )
}

export {ClientEditModalForm}
