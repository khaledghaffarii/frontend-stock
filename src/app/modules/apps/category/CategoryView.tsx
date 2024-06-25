import React, {useEffect, useState} from 'react'
import {Category} from './category-list/core/_models'
import {useNavigate, useParams} from 'react-router-dom'
import {getCategoryById, updateCategory} from './category-list/core/_requests'
import {useAuth} from '../../auth'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {useListView} from './category-list/core/ListViewProvider'
import {CategoryListLoading} from './category-list/components/loading/CategoryListLoading'
import clsx from 'clsx'
import {KTSVG, toAbsoluteUrl} from '../../../../_metronic/helpers'
import {Item1} from '../../../../_metronic/partials/content/activity/Item1'
import {Item2} from '../../../../_metronic/partials/content/activity/Item2'

type Props = {
  className: string
  category: Category | undefined
}

const CategoryView: React.FC<Props> = ({className, category}) => {
  const [showDetails, setShowDetails] = useState(false)
  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }
  const {id} = useParams<{id: any}>()
  const {auth} = useAuth()
  const [categoryData, setCategoryData] = useState<Category | null>(null)
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)
  const navigate = useNavigate()
  const {setItemIdForUpdate} = useListView()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = auth?.token
        if (token) {
          const data = await getCategoryById(id, token)
          //@ts-ignore
          setCategoryData(data?.data)
        }
      } catch (error) {
        console.log('🚀 ~ fetchData ~ error:', error)
      }
    }
    fetchData()
  }, [id, auth])

  const editClientSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'Minimum 3 caractères')
      .max(50, 'Maximum 50 caractères')
      .required('Le nom est requis'),
  })

  const formik = useFormik({
    initialValues: {
      name: categoryData?.name,

      createdAt: categoryData?.createdAt,
    },
    enableReinitialize: true,
    validationSchema: editClientSchema,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      setHasErrors(undefined)
      try {
        const token = auth?.token
        if (token) {
          await updateCategory(id, values, token)
          navigate(`/apps/category-management/category`)
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

  if (!categoryData) {
    return <CategoryListLoading />
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
                {...formik.getFieldProps('name')}
                type='text'
                name='name'
                value={formik.values.name}
                className={clsx(
                  'form-control form-control-solid border border-secondary',
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
              {/* end::Input */}
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
        <div className='card card-body mx-5 position-relative' id='kt_activities_body'>
          <h3 className='m-5 text-muted'>Produits correspondants</h3>
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
              <div className='timeline-item'>
                <div className='timeline-line w-40px'></div>

                <div
                  className='timeline-icon symbol symbol-circle symbol-40px'
                  onClick={toggleDetails}
                  style={{cursor: 'pointer'}}
                >
                  <div className='symbol-label bg-light'>
                    <KTSVG
                      path='/media/icons/duotune/communication/com009.svg'
                      className='svg-icon-2 svg-icon-gray-500'
                    />
                  </div>
                </div>

                <div className='timeline-content mb-10 mt-n2 '>
                  <div className='overflow-auto pe-3'>
                    <button onClick={toggleDetails} className='fs-5 fw-bold mt-5 border-0'>
                      Bobine 125 rame papier
                    </button>
                    {showDetails && (
                      <div className='mt-3'>
                        <div className='d-flex align-items-center mt-1 fs-6'>
                          <div className='text-muted me-2 fs-5'>Date de creation:</div>
                          <div className='fs-5'>15 juin 2024 à 14:23</div>
                        </div>
                        <div className='d-flex align-items-center mt-1 fs-6'>
                          <div className='text-muted me-2 fs-5'>Quantité:</div>
                          <div className='fs-5'>125</div>
                        </div>

                        <div className='d-flex align-items-center mt-1 fs-6'>
                          <div className='text-muted me-2 fs-5'>Statut:</div>
                          <div className='fs-5'>Vendu</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {formik.isSubmitting && <CategoryListLoading />}
    </>
  )
}

export default CategoryView
