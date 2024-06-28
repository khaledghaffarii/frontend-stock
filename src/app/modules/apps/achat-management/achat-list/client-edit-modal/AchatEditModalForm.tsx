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
// import {Formik, Form, Field, FieldArray} from 'formik'
import {Button, Container, Row, Col, Form as BootstrapForm, Table, Modal} from 'react-bootstrap'
//import 'bootstrap/dist/css/bootstrap.min.css'
import {products, suppliers} from './data'
import {useNavigate} from 'react-router-dom'
type Props = {
  isUserLoading: boolean
  achat: Achat
}

const editAchatSchema = Yup.object().shape({
  quantity: Yup.number().required('La quantity est requis').positive().integer(),
  unitPurchasePrice: Yup.number().required('Le prix est requis').positive(),
  //tva: Yup.number().required('TVA est requis').positive().integer(),
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
  const navigate = useNavigate()
  const [productId, setProductId] = useState<any>()
  console.log('🚀 ~ productId:', productId)
  const [oneProduct, setOneProduct] = useState<any>()
  console.log('🚀 ~ oneProduct:', oneProduct)
  const customStyles = {
    backdrop: {backgroundColor: 'rgba(0, 0, 0, 0.5)'},
    dialog: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      borderRadius: '10px',
    },
  }
  const [oneSupplier, setOneSupplier] = useState<any>()
  const [supplierId, setSupplierId] = useState<any>()
  const [totalHT, setTotalHT] = useState(0)
  const [totalTTC, setTotalTTC] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [showProductSelect, setShowProductSelect] = useState(false)
  const [purchaseForEdit] = useState<Achat>({
    ...achat,
    id: achat?.id,
    product: achat?.product,
    product_id: achat?.product_id,
    supplier_id: achat?.supplier_id,
    quantity: achat?.quantity,
    tva: achat?.tva ?? 0,
    unitPurchasePrice: achat?.unitPurchasePrice,
    totalPurchasePrice: achat?.totalPurchasePrice,
    createdAt: achat?.createdAt,
  })

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
            console.log('🚀 ~ fetchDataOneProduct ~ data:', data)
            //@ts-ignore
            setOneProduct(data?.data)
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
  }, [supplierId, productId, token])

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
    initialValues: purchaseForEdit,
    validationSchema: editAchatSchema,
    onSubmit: async (values, {setSubmitting}) => {
      console.log('🚀 ~ onSubmit: ~ values FINAL:', values)
      setSubmitting(true)
      try {
        // values.totalPurchasePrice =
        //   values.quantity * values.unitPurchasePrice * (1 + values.tva / 100)
        const createdAchat: any = await createAchat(values, token)
        console.log('🚀 ~ onSubmit: ~ createdAchat:', createdAchat)
        setSubmitting(false)
        setItemIdForUpdate(undefined)
        refetch()
        navigate(`/apps/achat-management/achat/view/${createdAchat.id}`)
        return createdAchat
      } catch (ex) {
        setSubmitting(false)
        console.error(ex)
      }
    },
  })

  useEffect(() => {
    const unitPrice = parseFloat(formik.values.unitPurchasePrice)
    const quantity = parseFloat(formik.values.quantity)
    const tva = formik.values.tva

    if (!isNaN(unitPrice) && !isNaN(quantity) && !isNaN(tva)) {
      const totalHT = unitPrice * quantity
      const totalTTC = totalHT * (1 + tva / 100)

      setTotalHT(totalHT)
      setTotalTTC(totalTTC)
    }
  }, [formik.values.unitPurchasePrice, formik.values.quantity, formik.values.tva])
  const handleAddProductClick = () => {
    if (!supplierId) {
      setShowModal(true)
    } else {
      setShowProductSelect(true)
    }
  }
  return (
    <Container>
      <form id='kt_modal_add_user_form' className='form' onSubmit={formik.handleSubmit} noValidate>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: 50,
          }}
        >
          <BootstrapForm.Group>
            <BootstrapForm.Label>Sélectionner le fournisseur :</BootstrapForm.Label>
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
                  <BootstrapForm.Label className=' me-3 w-100 mt-3'>Adresse :</BootstrapForm.Label>
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
        {!showProductSelect && (
          <Row>
            <Col>
              <Button variant='success' onClick={handleAddProductClick}>
                Ajouter un produit
              </Button>
            </Col>
          </Row>
        )}
        {showProductSelect && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 50,
              width: '105%',
            }}
          >
            <BootstrapForm.Group>
              <BootstrapForm.Label>Sélectionner le produit :</BootstrapForm.Label>
              <div className='mb-3'>
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
                    'form-select fw-bolder',
                    {
                      'is-invalid': formik.touched.product_id && formik.errors.product_id,
                    },
                    {
                      'is-valid': formik.touched.product_id && !formik.errors.product_id,
                    }
                  )}
                >
                  <option value='' disabled selected>
                    Choisissez un produit
                  </option>
                  {productData &&
                    productData.map((product: any) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                </select>
                {formik.touched.product_id && formik.errors.product_id ? (
                  <div className='invalid-feedback'>{formik.errors.product_id}</div>
                ) : null}
              </div>
            </BootstrapForm.Group>

            {oneProduct && (
              <div className='mb-4'>
                <h5>Détails du Produit</h5>
                <hr />
                <div className='d-flex flex-column '>
                  <BootstrapForm.Group className='mb-1 d-flex align-items-center  justify-content-arround '>
                    <BootstrapForm.Label className='fw-bold me-3 w-100 mt-3'>
                      Nom produit :
                    </BootstrapForm.Label>
                    <BootstrapForm.Control
                      type='text'
                      value={oneProduct?.name}
                      readOnly
                      className='flex-grow-1 border-0 fw-light text-start '
                    />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group className='mb-1 d-flex align-items-center  justify-content-arround '>
                    <BootstrapForm.Label className='fw-bold me-3 w-100 mt-3'>
                      Quantité Actuelle en stock :
                    </BootstrapForm.Label>
                    <BootstrapForm.Control
                      type='text'
                      value={oneProduct?.quantity}
                      readOnly
                      className='flex-grow-1 border-0 fw-light text-start '
                    />
                  </BootstrapForm.Group>

                  <BootstrapForm.Group className='mb-1 d-flex align-items-center  justify-content-arround   '>
                    <BootstrapForm.Label className=' me-3 w-100 mt-3'>
                      Prix de Vente (TND) :
                    </BootstrapForm.Label>
                    <BootstrapForm.Control
                      type='text'
                      value={oneProduct?.priceSale}
                      readOnly
                      className='flex-grow-1 border-0 fw-light text-start  '
                    />
                  </BootstrapForm.Group>
                </div>
              </div>
            )}
          </div>
        )}
        <>
          <div>
            <div className='mt-5 mb-5 '>
              <Row className='align-items-center'>
                <Col md={2}>
                  <BootstrapForm.Group>
                    <div className=' fv-row d-flex flex-column mt-5  fv-row'>
                      <BootstrapForm.Control
                        type='text'
                        value={oneProduct?.name}
                        readOnly
                        className='flex-grow-1 fw-bold fw-light text-start border-0 fs-4'
                      />
                      <p style={{marginLeft: 13, fontSize: 12, marginTop: -8}}>
                        {oneProduct?.category.name}
                      </p>

                      {/* <BootstrapForm.Control
                        type='text'
                        value={oneProduct.category.name}
                        readOnly
                        className='flex-grow-1  fw-light text-start border-0 '
                      /> */}
                    </div>
                  </BootstrapForm.Group>
                </Col>

                <Col md={2}>
                  <BootstrapForm.Group>
                    <div className='d-flex flex-column mb-7 fv-row'>
                      <BootstrapForm.Label className='d-flex align-items-center fs-6 fw-bold form-label mt-3'>
                        Prix unitaire HT
                      </BootstrapForm.Label>
                      <input
                        {...formik.getFieldProps('unitPurchasePrice')}
                        type='number'
                        name='unitPurchasePrice'
                        onChange={(e) => {
                          formik.handleChange(e)
                          const unitPrice = parseFloat(e.target.value)
                          const quantity = parseFloat(formik.values.quantity)
                          const tva = formik.values.tva
                          if (!isNaN(unitPrice) && !isNaN(quantity) && !isNaN(tva)) {
                            const totalHT = unitPrice * quantity
                            const totalTTC = totalHT * (1 + tva / 100)
                            setTotalHT(totalHT)
                            setTotalTTC(totalTTC)
                          }
                        }}
                        value={formik.values.unitPurchasePrice}
                        className={clsx(
                          'form-control form-control-lg form-control-solid',
                          {
                            'is-invalid':
                              formik.touched.unitPurchasePrice && formik.errors.unitPurchasePrice,
                          },
                          {
                            'is-valid':
                              formik.touched.unitPurchasePrice && !formik.errors.unitPurchasePrice,
                          }
                        )}
                        disabled={!supplierId}
                      />
                    </div>
                  </BootstrapForm.Group>
                </Col>

                <Col md={2}>
                  <BootstrapForm.Group>
                    <div className='d-flex flex-column mb-7 fv-row '>
                      <BootstrapForm.Label className='d-flex align-items-center fs-6 fw-bold form-label mt-3'>
                        Quantité
                      </BootstrapForm.Label>
                      <input
                        {...formik.getFieldProps('quantity')}
                        type='number'
                        name='quantity'
                        onChange={(e) => {
                          formik.handleChange(e)
                          const quantity = parseFloat(e.target.value)
                          const unitPrice = parseFloat(formik.values.unitPurchasePrice)
                          const tva = formik.values.tva
                          if (!isNaN(unitPrice) && !isNaN(quantity) && !isNaN(tva)) {
                            const totalHT = unitPrice * quantity
                            const totalTTC = totalHT * (1 + tva / 100)
                            setTotalHT(totalHT)
                            setTotalTTC(totalTTC)
                          }
                        }}
                        value={formik.values.quantity}
                        className={clsx(
                          'form-control form-control-lg form-control-solid fw-bolder ',
                          {'is-invalid': formik.touched.quantity && formik.errors.quantity},
                          {
                            'is-valid': formik.touched.quantity && !formik.errors.quantity,
                          }
                        )}
                        disabled={!supplierId}
                      />
                    </div>
                  </BootstrapForm.Group>
                </Col>
                <Col md={2}>
                  <BootstrapForm.Group>
                    <div className='d-flex flex-column mb-7 fv-row'>
                      <BootstrapForm.Label className='d-flex align-items-center fs-6 fw-bold form-label mt-3'>
                        TVA
                      </BootstrapForm.Label>
                      <select
                        {...formik.getFieldProps('tva')}
                        onChange={(e) => {
                          formik.handleChange(e)
                          const tva = parseFloat(e.target.value)
                          const quantity = parseFloat(formik.values.quantity)
                          const unitPrice = parseFloat(formik.values.unitPurchasePrice)
                          if (!isNaN(unitPrice) && !isNaN(quantity) && !isNaN(tva)) {
                            const totalHT = unitPrice * quantity
                            const totalTTC = totalHT * (1 + tva / 100)
                            setTotalHT(totalHT)
                            setTotalTTC(totalTTC)
                          }
                        }}
                        name='tva'
                        value={formik.values.tva}
                        className={clsx(
                          'form-select form-select-lg form-select-solid fw-bolder',
                          {'is-invalid': formik.touched.tva && formik.errors.tva},
                          {
                            'is-valid': formik.touched.tva && !formik.errors.tva,
                          }
                        )}
                        disabled={!supplierId}
                      >
                        <option value='' disabled>
                          Sélectionner TVA
                        </option>
                        <option value={0}>0%</option>
                        <option value={19}>19%</option>
                      </select>
                    </div>
                  </BootstrapForm.Group>
                </Col>

                <Col md={2}>
                  <BootstrapForm.Group>
                    <div className='d-flex flex-column mb-7 fv-row'>
                      <BootstrapForm.Label className='d-flex align-items-center fs-6 fw-bold form-label mt-3'>
                        Total HT
                      </BootstrapForm.Label>
                      <input
                        type='text'
                        value={totalHT.toFixed(2)}
                        readOnly
                        className='form-control form-control-lg form-control-solid'
                      />
                    </div>
                  </BootstrapForm.Group>
                </Col>
                <Col md={2}>
                  <BootstrapForm.Group>
                    <div className='d-flex flex-column mb-7 fv-row'>
                      <BootstrapForm.Label className='d-flex align-items-center fs-6 fw-bold form-label mt-3'>
                        Total TTC
                      </BootstrapForm.Label>
                      <input
                        type='text'
                        value={totalTTC.toFixed(2)}
                        readOnly
                        className='form-control form-control-lg form-control-solid'
                      />
                    </div>
                  </BootstrapForm.Group>
                </Col>
              </Row>
            </div>
          </div>
        </>

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
                Prix total HT
              </th>
              <th className='fw-bold ' style={{width: '120px'}}>
                Prix total TTC
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>{oneProduct?.name}</td>
              <td>{formik.values.unitPurchasePrice} TND</td>
              <td>{formik.values.quantity}</td>
              <td>{totalHT.toFixed(2)} TND</td>
              <td>{totalTTC.toFixed(2)} TND</td>
            </tr>
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
                <td className='text-end'>{formik.values.tva}%</td>
              </tr>
              <tr>
                <th scope='row' className='fw-bold text-start'>
                  Total TTC
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
        <div className='w-100 mt-4 d-flex justify-content-center m-5 gap-8'>
          <Button onClick={() => navigate(-1)} variant='secondary'>
            Annuler
          </Button>
          <Button type='submit' variant='success'>
            Soumettre
          </Button>
        </div>
      </form>
      <Modal
        className=' alert  d-flex flex-center flex-column py-10 px-10 px-lg-20 mb-10'
        show={showModal}
        onHide={() => setShowModal(false)}
        style={customStyles.backdrop}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className='bi bi-exclamation-circle-fill text-danger fs-1 m-5'></i>Erreur
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='fs-3'>
          Veuillez sélectionner un fournisseur avant d'ajouter un produit.
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowModal(false)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export {AchatEditModalForm}
