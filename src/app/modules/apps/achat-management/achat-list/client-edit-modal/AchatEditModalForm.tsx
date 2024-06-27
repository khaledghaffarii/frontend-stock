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
import {getSupplier, getSupplierById} from '../../../supplier-management/users-list/core/_requests'
import {getProduct, getProductById} from '../../../product-management/product-list/core/_requests'
import {Formik, Form, Field, FieldArray} from 'formik'
import {Button, Container, Row, Col, Form as BootstrapForm, Table} from 'react-bootstrap'
//import 'bootstrap/dist/css/bootstrap.min.css'
import {products, suppliers} from './data'
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
  const [productData, setProductData] = useState<any>()
  const [supplierData, setSupplierData] = useState<any>()

  const [productId, setProductId] = useState<any>()
  const [oneProduct, setOneProduct] = useState<any>()
  const [oneSupplier, setOneSupplier] = useState<any>()
  const [supplierId, setSupplierId] = useState<any>()
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

  const [selectedSupplier, setSelectedSupplier] = useState<any>(null)

  // const handleSupplierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const supplierId = parseInt(e.target.value)
  //   const supplier = suppliers.find((s: any) => s.id === supplierId)
  //   setSelectedSupplier(supplier || null)
  // }
  const [error, setError] = useState<string | null>(null)

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }
  useEffect(() => {
    try {
      const fetchDataOneProduct = async () => {
        try {
          const token: any = auth?.token
          if (productId) {
            const data = await getProductById(productId && productId, token)
            setOneProduct(data)
          }
        } catch (error) {
          console.log('🚀 ~ file: GroupEditModalForm.tsx:43 ~ fetchDataOneProduct ~ error:', error)
        }
      }

      const fetchDataOneSupplier = async () => {
        try {
          const token: any = auth?.token
          if (supplierId) {
            const data = await getSupplierById(supplierId && supplierId, token)
            //@ts-ignore
            setOneSupplier(data?.data)
          }
        } catch (error) {
          console.log('🚀 ~ file: GroupEditModalForm.tsx:43 ~ fetchDataOneProduct ~ error:', error)
        }
      }
      if (supplierId) {
        fetchDataOneSupplier()
      }
      if (productId) {
        fetchDataOneProduct()
      }
    } catch (error) {}
  }, [supplierId, token])

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
          console.log('🚀 ~ fetchData supplier~ data:', data)

          setSupplierData(data?.data)
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
    // <>
    //   {error && (
    //     <div className='alert alert-dismissible bg-light-danger d-flex flex-column flex-sm-row p-5 mb-10'>
    //       <span className='svg-icon svg-icon-2hx svg-icon-primary me-4 mb-5 mb-sm-0'>
    //         <i className='bi bi-exclamation-circle text-danger fs-3'></i>
    //       </span>
    //       <div className='d-flex flex-column text-primary pe-0 pe-sm-10'>
    //         <h5 className='mb-1 '>Erreur lors de l'ajout du Client</h5>
    //         <span className='fs-7 text-dark'>
    //           L'ajout du Client a échoué en raison de duplications dans les champs. Veuillez
    //           vérifier les informations saisies. email, ce nom complet ou numéro de téléphone existe
    //           déjà .
    //         </span>
    //       </div>

    //       <button
    //         type='button'
    //         className='position-absolute position-sm-relative m-2 m-sm-0 top-0 end-0 btn btn-icon ms-sm-auto'
    //         data-bs-dismiss='alert'
    //       >
    //         <span className='svg-icon svg-icon-1 svg-icon-primary'>...</span>
    //       </button>
    //     </div>
    //   )}

    //   <form id='kt_modal_add_user_form' className='form' onSubmit={formik.handleSubmit} noValidate>
    //     <div
    //       className='d-flex flex-column scroll-y me-n7 pe-7'
    //       id='kt_modal_add_user_scroll'
    //       data-kt-scroll='true'
    //       data-kt-scroll-activate='{default: false, lg: true}'
    //       data-kt-scroll-max-height='auto'
    //       data-kt-scroll-dependencies='#kt_modal_add_user_header'
    //       data-kt-scroll-wrappers='#kt_modal_add_user_scroll'
    //       data-kt-scroll-offset='300px'
    //     >
    //       <div className='fv-row mb-7'></div>

    //       <div className='mb-10'>
    //         <label className='form-label fs-6 fw-bold'>Produit</label>
    //         <select
    //           {...formik.getFieldProps('product_id')}
    //           data-allow-clear='true'
    //           onChange={(e) => {
    //             // const product_Id = e.target.value
    //             // const selectedFormCategory = ProductData.find(
    //             //   (form: any) => form.id === product_Id
    //             // )
    //             // formik.setFieldValue('categoryId', e.target.value)

    //             formik.setFieldValue('product_id', e.target.value)
    //             setCategoryId(e.target.value)
    //           }}
    //           //onChange={(e) => setCategoryId(e.target.value)}
    //           id='product_id'
    //           name='product_id'
    //           value={categoryId}
    //           className={clsx(
    //             'form-select form-select-solid fw-bolder',
    //             {'is-invalid': formik.touched.product_id && formik.errors.product_id},
    //             {
    //               'is-valid': formik.touched.product_id && !formik.errors.product_id,
    //             }
    //           )}
    //         >
    //           <option value='' disabled selected>
    //             choisi un produit
    //           </option>
    //           {ProductData &&
    //             ProductData.map((product: any) => (
    //               <option key={product.id} value={product.id}>
    //                 {product.name}
    //               </option>
    //             ))}
    //         </select>
    //       </div>
    //       {formik.touched.product_id && formik.errors.product_id && (
    //         <div className='fv-plugins-message-container'>
    //           <div className='fv-help-block'>
    //             <span role='alert'>{formik.errors.product_id}</span>
    //           </div>
    //         </div>
    //       )}
    //       <div className='mb-10'>
    //         <label className='form-label fs-6 fw-bold'>Fournisseur</label>
    //         <select
    //           {...formik.getFieldProps('product_id')}
    //           data-allow-clear='true'
    //           onChange={(e) => {
    //             // const product_Id = e.target.value
    //             // const selectedFormCategory = CategogyData.find(
    //             //   (form: any) => form.id === product_Id
    //             // )
    //             // formik.setFieldValue('categoryId', e.target.value)

    //             formik.setFieldValue('supplier_id', e.target.value)
    //             setCategoryId(e.target.value)
    //           }}
    //           //onChange={(e) => setCategoryId(e.target.value)}
    //           id='supplier_id'
    //           name='supplier_id'
    //           value={categoryId}
    //           className={clsx(
    //             'form-select form-select-solid fw-bolder',
    //             {'is-invalid': formik.touched.supplier_id && formik.errors.supplier_id},
    //             {
    //               'is-valid': formik.touched.supplier_id && !formik.errors.supplier_id,
    //             }
    //           )}
    //         >
    //           <option value='' disabled selected>
    //             choisi un produit
    //           </option>
    //           {supplierData &&
    //             supplierData.map((supplier: any) => (
    //               <option key={supplier.id} value={supplier.id}>
    //                 {supplier.name}
    //               </option>
    //             ))}
    //         </select>
    //       </div>
    //       {formik.touched.supplier_id && formik.errors.supplier_id && (
    //         <div className='fv-plugins-message-container'>
    //           <div className='fv-help-block'>
    //             <span role='alert'>{formik.errors.supplier_id}</span>
    //           </div>
    //         </div>
    //       )}
    //       <div className='fv-row mb-7'>
    //         <label className='required fw-bold fs-6 mb-2'>Quantité</label>
    //         <input
    //           placeholder='Quantité'
    //           {...formik.getFieldProps('quantity')}
    //           type='number'
    //           name='quantity'
    //           className={clsx(
    //             'form-control form-control-solid mb-3 mb-lg-0',
    //             {'is-invalid': formik.touched.quantity && formik.errors.quantity},
    //             {
    //               'is-valid': formik.touched.quantity && !formik.errors.quantity,
    //             }
    //           )}
    //           autoComplete='off'
    //           disabled={formik.isSubmitting}
    //         />
    //         {formik.touched.quantity && formik.errors.quantity && (
    //           <div className='fv-plugins-message-container'>
    //             <div className='fv-help-block'>
    //               <span role='alert'>{formik.errors.quantity}</span>
    //             </div>
    //           </div>
    //         )}
    //       </div>
    //       <div className='fv-row mb-7'>
    //         <label className='required fw-bold fs-6 mb-2'>Prix unitaire</label>
    //         <input
    //           placeholder='Prix unitaire'
    //           {...formik.getFieldProps('unitPurchasePrice')}
    //           className={clsx(
    //             'form-control form-control-solid mb-3 mb-lg-0',
    //             {
    //               'is-invalid': formik.touched.unitPurchasePrice && formik.errors.unitPurchasePrice,
    //             },
    //             {
    //               'is-valid': formik.touched.unitPurchasePrice && !formik.errors.unitPurchasePrice,
    //             }
    //           )}
    //           type='unitPurchasePrice'
    //           name='unitPurchasePrice'
    //           autoComplete='off'
    //           disabled={formik.isSubmitting}
    //         />
    //         {formik.touched.unitPurchasePrice && formik.errors.unitPurchasePrice && (
    //           <div className='fv-plugins-message-container'>
    //             <span role='alert'>{formik.errors.unitPurchasePrice}</span>
    //           </div>
    //         )}
    //       </div>
    //       <div className='fv-row mb-7'>
    //         <label className='required fw-bold fs-6 mb-2'>Prix total</label>
    //         <input
    //           placeholder='Prix total'
    //           {...formik.getFieldProps('totalPurchasePrice')}
    //           className={clsx(
    //             'form-control form-control-solid mb-3 mb-lg-0',
    //             {
    //               'is-invalid':
    //                 formik.touched.totalPurchasePrice && formik.errors.totalPurchasePrice,
    //             },
    //             {
    //               'is-valid':
    //                 formik.touched.totalPurchasePrice && !formik.errors.totalPurchasePrice,
    //             }
    //           )}
    //           type='number'
    //           name='totalPurchasePrice'
    //           autoComplete='off'
    //           disabled={formik.isSubmitting}
    //         />
    //         {formik.touched.totalPurchasePrice && formik.errors.totalPurchasePrice && (
    //           <div className='fv-plugins-message-container'>
    //             <div className='fv-help-block'>
    //               <span role='alert'>{formik.errors.totalPurchasePrice}</span>
    //             </div>
    //           </div>
    //         )}
    //       </div>
    //     </div>

    //     <div className='text-center pt-15'>
    //       <button
    //         type='reset'
    //         onClick={() => cancel()}
    //         className='btn btn-light me-3'
    //         data-kt-users-modal-action='cancel'
    //         disabled={formik.isSubmitting || isUserLoading}
    //       >
    //         Annuler
    //       </button>

    //       <button
    //         type='submit'
    //         className='btn btn-primary'
    //         data-kt-users-modal-action='submit'
    //         disabled={isUserLoading || formik.isSubmitting || !formik.isValid || !formik.touched}
    //       >
    //         <span className='indicator-label'>Soumettre</span>
    //         {(formik.isSubmitting || isUserLoading) && (
    //           <span className='indicator-progress'>
    //             Veuillez patienter...{' '}
    //             <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
    //           </span>
    //         )}
    //       </button>
    //     </div>
    //   </form>
    //   {(formik.isSubmitting || isUserLoading) && <AchatListLoading />}
    // </>
    <Container>
      <Formik
        initialValues={{
          supplierId: '',
          items: [
            {
              productId: '',
              name: '',
              price: 0,
              qty: 1,
              discount: 0,
              total: 0,
            },
          ],
          salesperson: 'Edward Crowley',
          notes: '',
        }}
        onSubmit={(values) => {
          console.log(values)
        }}
      >
        {({values, setFieldValue}) => {
          const totalHT = values.items.reduce(
            (acc, item) => acc + item.price * item.qty * (1 - item.discount / 100),
            0
          )
          const TVA = totalHT * 0.2 // Assuming 20% tax rate
          const totalTTC = totalHT + TVA

          return (
            <Form>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 50,
                }}
              >
                {' '}
                <BootstrapForm.Group>
                  <BootstrapForm.Label>Sélectionner le fournisseur :</BootstrapForm.Label>
                  {/* <Field
                    as='select'
                    name='supplierId'
                    className='form-control'
                    onChange={handleSupplierChange}
                  >
                    <option value=''>Tout les fournisseur</option>
                    {suppliers.map((supplier: any) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </Field> */}
                  <div className='mb-10'>
                    <select
                      {...formik.getFieldProps('supplier_id')}
                      data-allow-clear='true'
                      onChange={(e) => {
                        // const product_Id = e.target.value
                        // const selectedFormCategory = CategogyData.find(
                        //   (form: any) => form.id === product_Id
                        // )
                        // formik.setFieldValue('categoryId', e.target.value)

                        formik.setFieldValue('supplier_id', e.target.value)
                        setSupplierId(e.target.value)
                      }}
                      id='supplier_id'
                      name='supplier_id'
                      value={supplierId}
                      className={clsx(
                        'form-select  fw-bolder',
                        {'is-invalid': formik.touched.supplier_id && formik.errors.supplier_id},
                        {
                          'is-valid': formik.touched.supplier_id && !formik.errors.supplier_id,
                        }
                      )}
                    >
                      <option value='' disabled selected>
                        choisi un fournisseur
                      </option>
                      {supplierData &&
                        supplierData.map((supplier: any) => (
                          <option key={supplier.id} value={supplier.id}>
                            {supplier.fullname}
                          </option>
                        ))}
                    </select>
                  </div>
                </BootstrapForm.Group>
                {oneSupplier && (
                  <div className='mb-4'>
                    <h5>Détails du fournisseur</h5>
                    <hr />
                    <div className='d-flex flex-column '>
                      <BootstrapForm.Group className='mb-1 d-flex align-items-center  justify-content-arround '>
                        <BootstrapForm.Label className='fw-bold me-3 w-100 mt-3'>
                          Société :
                        </BootstrapForm.Label>
                        <BootstrapForm.Control
                          type='text'
                          value={oneSupplier.company}
                          readOnly
                          className='flex-grow-1 border-0 fw-light text-start '
                        />
                      </BootstrapForm.Group>
                      <BootstrapForm.Group className='mb-1 d-flex align-items-center  justify-content-arround '>
                        <BootstrapForm.Label className='fw-bold me-3 w-100 mt-3'>
                          Nom et prenom :
                        </BootstrapForm.Label>
                        <BootstrapForm.Control
                          type='text'
                          value={oneSupplier.fullname}
                          readOnly
                          className='flex-grow-1 border-0 fw-light text-start '
                        />
                      </BootstrapForm.Group>
                      <BootstrapForm.Group className='mb-1 d-flex align-items-center  justify-content-arround '>
                        <BootstrapForm.Label className='fw-bold me-3 w-100 mt-3'>
                          Email :
                        </BootstrapForm.Label>
                        <BootstrapForm.Control
                          type='text'
                          value={oneSupplier.email}
                          readOnly
                          className='flex-grow-1 border-0 fw-light text-start '
                        />
                      </BootstrapForm.Group>
                      <BootstrapForm.Group className='mb-1 d-flex align-items-center  justify-content-arround '>
                        <BootstrapForm.Label className='fw-bold me-3 w-100 mt-3'>
                          Téléphonne :
                        </BootstrapForm.Label>
                        <BootstrapForm.Control
                          type='text'
                          value={oneSupplier.phone}
                          readOnly
                          className='flex-grow-1 border-0 fw-light text-start '
                        />
                      </BootstrapForm.Group>
                      <BootstrapForm.Group className='mb-1 d-flex align-items-center  justify-content-arround   '>
                        <BootstrapForm.Label className=' me-3 w-100 mt-3'>
                          Adresse :
                        </BootstrapForm.Label>
                        <BootstrapForm.Control
                          type='text'
                          value={oneSupplier.address}
                          readOnly
                          className='flex-grow-1 border-0 fw-light text-start  '
                        />
                      </BootstrapForm.Group>
                    </div>
                  </div>
                )}
              </div>

              <FieldArray name='items'>
                {({remove, push}) => (
                  <>
                    {values.items.map((item, index) => (
                      <div>
                        <BootstrapForm.Label>Sélectionner le produit :</BootstrapForm.Label>
                        <div key={index} className='mt-5 mb-5'>
                          <Row className='align-items-center'>
                            <Col md={2}>
                              <BootstrapForm.Group>
                                <BootstrapForm.Label>Produit :</BootstrapForm.Label>
                                <div className=''>
                                  <select
                                    {...formik.getFieldProps('product_id')}
                                    data-allow-clear='true'
                                    onChange={(e) => {
                                      formik.setFieldValue('product_id', e.target.value)
                                      setProductId(e.target.value)
                                    }}
                                    id='product_id'
                                    name='product_id'
                                    value={productId}
                                    className={clsx(
                                      'form-select  fw-bolder',
                                      {
                                        'is-invalid':
                                          formik.touched.product_id && formik.errors.product_id,
                                      },
                                      {
                                        'is-valid':
                                          formik.touched.product_id && !formik.errors.product_id,
                                      }
                                    )}
                                  >
                                    <option value='' disabled selected>
                                      Choisi un produit
                                    </option>
                                    {productData &&
                                      productData.map((product: any) => (
                                        <option key={product.id} value={product.id}>
                                          {product.name}
                                        </option>
                                      ))}
                                  </select>
                                </div>
                              </BootstrapForm.Group>
                            </Col>

                            <Col md={2}>
                              <BootstrapForm.Group>
                                <BootstrapForm.Label>Prix unitaire HT:</BootstrapForm.Label>
                                <Field
                                  value={oneProduct.priceSale}
                                  type='number'
                                  className='form-control'
                                  readOnly
                                />
                              </BootstrapForm.Group>
                            </Col>

                            <Col md={1}>
                              <BootstrapForm.Group>
                                <BootstrapForm.Label>Quantité :</BootstrapForm.Label>
                                <Field
                                  name={`items.${index}.qty`}
                                  type='number'
                                  className='form-control'
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const qty = parseInt(e.target.value)
                                    setFieldValue(`items.${index}.qty`, qty)
                                    setFieldValue(
                                      `items.${index}.total`,
                                      item.price * qty * (1 - item.discount / 100)
                                    )
                                  }}
                                />
                              </BootstrapForm.Group>
                            </Col>

                            <Col md={2}>
                              <BootstrapForm.Group>
                                <BootstrapForm.Label>TVA :</BootstrapForm.Label>
                                <Field
                                  as='select'
                                  name={`items.${index}.tva`}
                                  className='form-select'
                                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                    const tva = parseFloat(e.target.value)
                                    setFieldValue(`items.${index}.tva`, tva)
                                    setFieldValue(
                                      `items.${index}.total`,
                                      item.price *
                                        item.qty *
                                        (1 - item.discount / 100) *
                                        (1 + tva / 100)
                                    )
                                  }}
                                >
                                  <option value={0}>0%</option>
                                  <option value={19}>19%</option>
                                </Field>
                              </BootstrapForm.Group>
                            </Col>

                            <Col md={2}>
                              <BootstrapForm.Group>
                                <BootstrapForm.Label>Total :</BootstrapForm.Label>
                                <Field
                                  name={`items.${index}.total`}
                                  type='number'
                                  className='form-control'
                                  readOnly
                                />
                              </BootstrapForm.Group>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </FieldArray>
              <hr />

              <Table className='table table-hover ' hover variant='white'>
                <thead>
                  <tr>
                    <th style={{width: '70px'}} className='fw-bold '>
                      No.
                    </th>
                    <th className='fw-bold '>Désignation</th>
                    <th className='fw-bold '>Prix unitaire HT</th>
                    <th className='fw-bold '>Quantité</th>
                    <th className='fw-bold ' style={{width: '120px'}}>
                      Prix total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {values.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.productId}</td>
                      <td>{item.name}</td>
                      <td>{item.price}</td>
                      <td>{item.qty}</td>
                      <td>{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div style={{marginTop: 100}} className=' table-responsive text-end'>
                <table className='table table-striped table-borderless border-0 border-b-2 brc-default-l1 w-25'>
                  <tbody>
                    <tr>
                      <th scope='row' className='fw-bold text-start'>
                        Total HT
                      </th>
                      <td className='text-end'>{totalHT.toFixed(2)} TND</td>
                    </tr>
                    <tr>
                      <th scope='row' className='fw-bold text-start'>
                        TVA :
                      </th>
                      <td className='text-end'>19%</td>
                    </tr>
                    <tr>
                      <th scope='row' className='fw-bold text-start'>
                        Total TTC :
                      </th>
                      <td className='text-end'>{totalTTC.toFixed(2)} TND</td>
                    </tr>
                    <tr>
                      <th scope='row' className='fw-bold text-start'>
                        Net à payer
                      </th>
                      <td className='text-end'>
                        <h4 className='m-0 fw-semibold'>{totalTTC.toFixed(2)} TND</h4>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* <Table className='mt-5 w-25 text-start'>
                <tfoot>
                  <tr>
                    <td colSpan={5}>HT (Hors Taxe) :</td>
                    <td>{totalHT.toFixed(2)} €</td>
                  </tr>
                  <tr>
                    <td colSpan={5}>TVA (20%) :</td>
                    <td>{TVA.toFixed(2)} €</td>
                  </tr>
                  <tr>
                    <td colSpan={5}>TTC (Toutes Taxes Comprises) :</td>
                    <td>{totalTTC.toFixed(2)} €</td>
                  </tr>
                </tfoot>
              </Table> */}
              <div className='text-right'>
                <Button type='submit' variant='success'>
                  Soumettre
                </Button>
              </div>
            </Form>
          )
        }}
      </Formik>
    </Container>
  )
}

export {AchatEditModalForm}
