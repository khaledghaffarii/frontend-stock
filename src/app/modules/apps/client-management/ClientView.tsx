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
import RapportClient from './RapportClient'

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
  const [activeTab, setActiveTab] = useState<string>('overview')
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
  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
  }
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
    // status: Yup.string()
    //   .oneOf(['vendu', 'annulé', 'en attente', 'reporter'], 'Statut invalide')
    //   .required('Le statut est requis'),
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
      telephone: clientData?.phone,
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

    <div className=''>
      {' '}
      <div className='d-flex align-items-center  bg-light rounded'>
        <div className='me-5'>
          <div style={{}} className=' badge bg-success '>
            Active
          </div>
          <div
            className='d-flex align-items-center justify-content-center bg-light text-primary rounded'
            style={{height: '150px', width: '150px'}}
          >
            <img
              src='/media/avatars/blank.png'
              alt='Icon'
              style={{maxWidth: '100%', maxHeight: '100%'}}
            />
          </div>
        </div>
        <div>
          <h4>{clientData?.fullname}</h4>
          <div>
            <span className='text-muted'>Eamil:</span> {clientData?.email}
            <span className='ms-3 text-muted'>Entreprise :</span> {clientData?.company}
          </div>
          <div className='d-flex  justify-content-between  ' style={{width: '160vh'}}>
            {' '}
            <div className='d-flex mt-2 align-items-center '>
              <div className='me-3 text-center p-3 border'>
                <div className='text-muted'>P-00001</div>
                <div className='text-primary'>Identifiant unique</div>
              </div>
              <div className='me-3 text-center p-3 border'>
                <div className='text-muted'>150</div>
                <div className='text-primary'>FACTURES PAYÉES</div>
              </div>
              <div className='text-center p-3 border'>
                <div className='text-muted'>Activé</div>
                <div className='text-primary'>Statut</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='d-flex flex-md-row flex-column mt-8'>
        <div className='      col-xs-12 col-md-5'>
          <form
            id='kt_modal_add_user_form'
            className='   card   p-8 mt-8 '
            onSubmit={formik.handleSubmit}
            noValidate
          >
            <h4> Coordonnée</h4>
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
              {/* <div className='fv-row mb-7'>
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
            </div> */}
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
        </div>

        <div className='col-md-7 mx-5'>
          <RapportClient id={id} />
        </div>
      </div>
      {formik.isSubmitting && <ClientListLoading />}
    </div>
  )
}

export default ClientView
