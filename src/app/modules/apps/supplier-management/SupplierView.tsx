import React, {useEffect, useState} from 'react'
import {Supplier} from './users-list/core/_models'
import {useNavigate, useParams} from 'react-router-dom'
import {getSupplierById, updateSupplier} from './users-list/core/_requests'
import {useAuth} from '../../auth'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {useListView} from './users-list/core/ListViewProvider'
import {SupplierListLoading} from './users-list/components/loading/SupplierListLoading'
import clsx from 'clsx'
import {KTSVG, toAbsoluteUrl} from '../../../../_metronic/helpers'
import {Item1} from '../../../../_metronic/partials/content/activity/Item1'
import {Item2} from '../../../../_metronic/partials/content/activity/Item2'
import SupplierRapport from './SupplierRapport'

type Props = {
  className: string
  supplier: Supplier | undefined
}

const SupplierView: React.FC<Props> = ({className, supplier}) => {
  const {id} = useParams<{id: any}>()
  const {auth} = useAuth()
  const [supplierData, setSupplierData] = useState<Supplier | null>(null)
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)
  const navigate = useNavigate()
  const {setItemIdForUpdate} = useListView()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = auth?.token
        if (token) {
          const data = await getSupplierById(id, token)
          //@ts-ignore
          setSupplierData(data?.data)
        }
      } catch (error) {
        console.log('🚀 ~ fetchData ~ error:', error)
      }
    }
    fetchData()
  }, [id, auth])

  const editSupplierSchema = Yup.object().shape({
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
  const [showDetails, setShowDetails] = useState(false)

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }
  const formik = useFormik({
    initialValues: {
      fullname: supplierData?.fullname,
      email: supplierData?.email,
      address: supplierData?.address,
      telephone: supplierData?.phone,
      status: supplierData?.status,
      createdAt: supplierData?.createdAt,
    },
    enableReinitialize: true,
    validationSchema: editSupplierSchema,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      setHasErrors(undefined)
      try {
        const token = auth?.token
        if (token) {
          await updateSupplier(id, values, token)
          navigate(`/apps/supplier-management/suppliers`)
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

  if (!supplierData) {
    return <SupplierListLoading />
  }
  const handleCancel = () => {
    navigate(-1)
  }
  return (
    <>
      <div className=''>
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
            <h4>{supplierData?.fullname}</h4>
            <div>
              <span className='text-muted'>Eamil:</span> {supplierData?.email}
              <span className='ms-3 text-muted'>Entreprise :</span> {supplierData?.company}
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
        <div className='d-flex flex-md-row flex-column w-100'>
          <div className='d-flex flex-md-row flex-column mt-8 w-100'>
            <div className='col-xs-12 col-4 '>
              <form
                id='kt_modal_add_user_form'
                className='   card   p-8 mt-8 '
                onSubmit={formik.handleSubmit}
                noValidate
              >
                <h4> Coordonnée</h4>
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
            <div className='col-md-8 mx-5'>
              <SupplierRapport id={id} />
            </div>
          </div>
        </div>
        {formik.isSubmitting && <SupplierListLoading />}
      </div>
    </>
  )
}

export default SupplierView
