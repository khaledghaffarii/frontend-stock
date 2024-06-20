import React, {useEffect, useState} from 'react'
import {Client} from './users-list/core/_models'
import {useNavigate, useParams} from 'react-router-dom'
import {getClientById, updateClient} from './users-list/core/_requests'
import {useAuth} from '../../auth'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {useListView} from './users-list/core/ListViewProvider'
import {ClientListLoading} from './users-list/components/loading/ClientListLoading'
import clsx from 'clsx'
import {KTSVG, toAbsoluteUrl} from '../../../../_metronic/helpers'
import {Item1} from '../../../../_metronic/partials/content/activity/Item1'
import {Item2} from '../../../../_metronic/partials/content/activity/Item2'

type Props = {
  className: string
  client: Client | undefined
}

const ClientView: React.FC<Props> = ({className, client}) => {
  const {id} = useParams<{id: any}>()
  const {auth} = useAuth()
  const [clientData, setClientData] = useState<Client | null>(null)
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)
  const navigate = useNavigate()
  const {setItemIdForUpdate} = useListView()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = auth?.token
        if (token) {
          const data = await getClientById(id, token)
          //@ts-ignore
          setClientData(data?.data)
        }
      } catch (error) {
        console.log('🚀 ~ fetchData ~ error:', error)
      }
    }
    fetchData()
  }, [id, auth])

  const editClientSchema = Yup.object().shape({
    email: Yup.string()
      .email("Format d'email incorrect")
      .min(3, 'Minimum 3 caractères')
      .max(50, 'Maximum 50 caractères')
      .required("L'email est requis"),
    fullname: Yup.string()
      .min(3, 'Minimum 3 caractères')
      .max(50, 'Maximum 50 caractères')
      .required('Le nom est requis'),
    status: Yup.string()
      .oneOf(['vendu', 'annulé', 'en attente', 'reporter'], 'Statut invalide')
      .required('Le statut est requis'),
    telephone: Yup.string()
      .min(8, 'Minimum 8 caractères')
      .max(8, 'Maximum 8 caractères')
      .required('Le telephone est requis'),
  })

  const formik = useFormik({
    initialValues: {
      fullname: clientData?.fullname,
      email: clientData?.email,
      address: clientData?.address,
      telephone: clientData?.telephone,
      status: clientData?.status,
      createdAt: clientData?.createdAt,
    },
    enableReinitialize: true,
    validationSchema: editClientSchema,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      setHasErrors(undefined)
      try {
        const token = auth?.token
        if (token) {
          await updateClient(id, values, token)
          navigate(`/apps/client-management/clients`)
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

  if (!clientData) {
    return <ClientListLoading />
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
              {}
              <label className='required fw-bold fs-6 mb-2'>Nom Complet</label>
              <input
                placeholder='Nom complet'
                {...formik.getFieldProps('fullname')}
                type='text'
                name='fullname'
                value={formik.values.fullname}
                className={clsx(
                  'form-control form-control-solid border border-secondary',
                  {'is-invalid': formik.touched.fullname && formik.errors.fullname},
                  {
                    'is-valid': formik.touched.fullname && !formik.errors.fullname,
                  }
                )}
                autoComplete='off'
                disabled={formik.isSubmitting}
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
                  'form-control form-control-solid border border-secondary',
                  {'is-invalid': formik.touched.email && formik.errors.email},
                  {
                    'is-valid': formik.touched.email && !formik.errors.email,
                  }
                )}
                value={formik.values.email}
                type='email'
                name='email'
                autoComplete='off'
                disabled={formik.isSubmitting}
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
                  'form-control form-control-solid border border-secondary',
                  {'is-invalid': formik.touched.address && formik.errors.address},
                  {
                    'is-valid': formik.touched.address && !formik.errors.address,
                  }
                )}
                type='address'
                name='address'
                autoComplete='off'
                disabled={formik.isSubmitting}
                value={formik.values.address}
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
                  'form-control form-control-solid border border-secondary',
                  {'is-invalid': formik.touched.telephone && formik.errors.telephone},
                  {
                    'is-valid': formik.touched.telephone && !formik.errors.telephone,
                  }
                )}
                type='text'
                name='telephone'
                value={formik.values.telephone}
                autoComplete='off'
                disabled={formik.isSubmitting}
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
                aria-label='Default select example'
                {...formik.getFieldProps('status')}
                className={clsx(
                  'form-select form-select-solid fw-bolder border border-secondary',
                  {'is-invalid': formik.touched.status && formik.errors.status},
                  {
                    'is-valid': formik.touched.status && !formik.errors.status,
                  }
                )}
                name='status'
                value={formik.values.status}
                disabled={formik.isSubmitting}
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

      {formik.isSubmitting && <ClientListLoading />}
    </>
  )
}

export default ClientView
