import {FC, useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {isNotEmpty, stringifyRequestQuery, toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import {Sale} from '../core/_models'
import clsx from 'clsx'
import {useListView} from '../core/ListViewProvider'
import {SaleListLoading} from '../components/loading/SaleListLoading'
import {createSale} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'
import {useAuth} from '../../../../auth'
import {getCategory} from '../../../category/category-list/core/_requests'
import {useQueryRequest} from '../core/QueryRequestProvider'
import {getSupplier} from '../../../supplier-management/users-list/core/_requests'
import {getProduct, getProductById} from '../../../product-management/product-list/core/_requests'
// import {Formik, Form, Field, FieldArray} from 'formik'
import {Button, Container, Row, Col, Form as BootstrapForm, Table, Modal} from 'react-bootstrap'
//import 'bootstrap/dist/css/bootstrap.min.css'
import {products, suppliers} from './data'
import {useNavigate} from 'react-router-dom'
import {getClient, getClientById} from '../../../client-management/users-list/core/_requests'
type Props = {
  isUserLoading: boolean
  sale: Sale
}

const editSaleSchema = Yup.object().shape({
  quantity: Yup.number().required('La quantity est requis').positive().integer(),
  // unitPurchasePrice: Yup.number().required('Le prix est requis').positive(),
  //tva: Yup.number().required('TVA est requis').positive().integer(),
  saleDate: Yup.date().required('La date de vente est requise').nullable(),
})

const DevisEditModalForm: FC<Props> = ({sale, isUserLoading}) => {
  const {setItemIdForUpdate} = useListView()
  const {refetch} = useQueryResponse()
  const {currentUser, auth} = useAuth()
  const token: any = auth?.token
  const [categoryId, setCategoryId] = useState('')
  const {state} = useQueryRequest()
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state))
  const [CategogyData, setCategogyData] = useState<any>()
  const [productData, setProductData] = useState<any>()
  const [clientData, setClientData] = useState<any>()
  const navigate = useNavigate()
  const [productId, setProductId] = useState<any>()
  const [oneProduct, setOneProduct] = useState<any>()
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
  const [oneClient, setOneClient] = useState<any>()
  const [clientId, setClientId] = useState<any>()
  const [statusId, setStatusId] = useState<any>()
  console.log('🚀 ~ statusId:', statusId)
  const [totalHT, setTotalHT] = useState(0)
  const [totalTTC, setTotalTTC] = useState(0)
  const [totalTTCwt, setTotalTTCwt] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [showProductSelect, setShowProductSelect] = useState(false)
  const [saleForEdit] = useState<Sale>({
    ...sale,
    id: sale?.id,
    product_id: sale?.product_id,
    client_id: sale?.client_id,
    quantity: sale?.quantity,
    tva: sale?.tva ?? 0,
    status: 3,
    saleDate: sale?.saleDate,
    createdAt: sale?.createdAt,
  })
  const statusOptions = [
    {value: 0, label: 'Facture'},
    {value: 1, label: 'Bon de livraison'},
    {value: 2, label: 'Bon de commande'},
    {value: 3, label: 'Devis'},
  ]
  // const cancel = (withRefresh?: boolean) => {
  //   if (withRefresh) {
  //     refetch()
  //   }
  //   setItemIdForUpdate(undefined)
  // }

  useEffect(() => {
    try {
      const fetchDataOneProduct = async () => {
        try {
          const token: any = auth?.token
          if (productId) {
            const data = await getProductById(productId && productId, token)

            //@ts-ignore
            setOneProduct(data?.data)
          }
        } catch (error) {
          console.log('🚀 ~ file: GroupEditModalForm.tsx:43 ~ fetchDataOneProduct ~ error:', error)
        }
      }

      const fetchDataOneClient = async () => {
        try {
          const token: any = auth?.token
          if (clientId) {
            const data = await getClientById(clientId && clientId, token)
            //@ts-ignore
            setOneClient(data?.data)
          }
        } catch (error) {
          console.log('🚀 ~ file: GroupEditModalForm.tsx:43 ~ fetchDataOneProduct ~ error:', error)
        }
      }
      if (clientId) {
        fetchDataOneClient()
      }
      if (productId) {
        fetchDataOneProduct()
      }
    } catch (error) {}
  }, [clientId, productId, token])

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
          const data = await getClient(query, token)

          setClientData(data?.data)
        } catch (error) {
          console.log('🚀 ~ file: GroupEditModalForm.tsx:43 ~ fetchData ~ error:', error)
          // Handle error
        }
      }
      fetchData()
    } catch (error) {}
  }, [])
  const formik = useFormik({
    initialValues: saleForEdit,
    validationSchema: editSaleSchema,
    onSubmit: async (values, {setSubmitting}) => {
      console.log('🚀 ~ onSubmit: ~ values FINAL:', values)
      setSubmitting(true)
      try {
        // values.totalPurchasePrice =
        //   values.quantity * values.unitPurchasePrice * (1 + values.tva / 100)

        const createdSale: any = await createSale(values, token)
        console.log('🚀 ~ onSubmit: ~ createdSale:', createdSale)
        setSubmitting(false)
        setItemIdForUpdate(undefined)
        refetch()
        navigate(`/apps/sale-management/sale/view/${createdSale.id}`)
        return createdSale
      } catch (ex: any) {
        console.log('🚀 ~ onSubmit: ~ ex:', ex.response)
        setSubmitting(false)
      }
    },
  })

  useEffect(() => {
    const unitPrice = parseFloat(oneProduct?.priceSale)
    const quantity = parseFloat(formik.values.quantity)
    const tva = formik.values.tva

    if (!isNaN(unitPrice) && !isNaN(quantity) && !isNaN(tva)) {
      const totalHT = unitPrice * quantity
      const totalTTC = totalHT * (1 + tva / 100) + 1

      setTotalHT(totalHT)
      setTotalTTC(totalTTC)
      setTotalTTCwt(totalTTC - 1)
    }
  }, [oneProduct?.priceSale, formik.values.quantity, formik.values.tva])
  const handleAddProductClick = () => {
    if (!clientId) {
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
            marginBottom: 50,
          }}
        >
          <div
            style={{
              paddingRight: 50,
            }}
          >
            <BootstrapForm.Label>Date de vente :</BootstrapForm.Label>{' '}
            <div className='input-group date w-100 mb-12 ' data-provide='datepicker'>
              <input
                type='datetime-local'
                //name='saleDate'
                className='form-control '
                {...formik.getFieldProps('saleDate')}
                // Add additional attributes or event handlers as needed
              />
            </div>
          </div>
          <BootstrapForm.Group>
            <BootstrapForm.Label>Sélectionner le client :</BootstrapForm.Label>
            <div className='mb-10 w-100'>
              <select
                {...formik.getFieldProps('client_id')}
                data-allow-clear='true'
                onChange={(e) => {
                  // const product_Id = e.target.value
                  // const selectedFormCategory = CategogyData.find(
                  //   (form: any) => form.id === product_Id
                  // )
                  // formik.setFieldValue('categoryId', e.target.value)
                  formik.setFieldValue('client_id', e.target.value)
                  setClientId(e.target.value)
                }}
                id='client_id'
                name='client_id'
                value={clientId}
                className={clsx(
                  'form-select  fw-bolder w-100',
                  {'is-invalid': formik.touched.client_id && formik.errors.client_id},
                  {
                    'is-valid': formik.touched.client_id && !formik.errors.client_id,
                  }
                )}
              >
                <option value='' disabled selected>
                  Choisi un Client
                </option>
                {clientData &&
                  clientData.map((client: any) => (
                    <option key={client.id} value={client.id}>
                      {client.fullname}
                    </option>
                  ))}
              </select>
            </div>
          </BootstrapForm.Group>
        </div>
        {oneClient && (
          <div className='mb-12'>
            <h3 className='mb-12'>Détails du client</h3>
            <div className='table-responsive'>
              <table className='table table-bordered'>
                <thead>
                  <tr>
                    <th className='fw-bold '>Nom et prénom</th>
                    <th className='fw-bold '>Société</th>
                    <th className='fw-bold '>Email</th>
                    <th className='fw-bold '>Téléphone</th>
                    <th className='fw-bold '>Adresse</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{oneClient.fullname}</td>
                    <td>{oneClient.company}</td>
                    <td>{oneClient.email}</td>
                    <td>{oneClient.phone}</td>
                    <td>{oneClient.address}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showProductSelect && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              marginBottom: 50,
              width: '100%',
            }}
          >
            <BootstrapForm.Group>
              <BootstrapForm.Label>Sélectionner le produit :</BootstrapForm.Label>
              <div className='mb-3 w-25'>
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
              <div className='mb-12 mt-12'>
                <h3 className='mb-12'>Détails du Produit</h3>

                <div className='table-responsive'>
                  <table className='table table-bordered'>
                    <thead>
                      <tr>
                        <th className='fw-bold '>Nom produit</th>
                        <th className='fw-bold '>Quantité Actuelle en stock</th>
                        <th className='fw-bold '>Prix de Vente (TND)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{oneProduct?.name}</td>
                        <td>{oneProduct?.quantity}</td>
                        <td>{oneProduct?.priceSale}</td>
                      </tr>
                    </tbody>
                  </table>
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
                  {!showProductSelect && (
                    <Row>
                      <Col>
                        <Button
                          variant='outline-success border border-success'
                          onClick={handleAddProductClick}
                        >
                          Ajouter un produit
                        </Button>
                      </Col>
                    </Row>
                  )}
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
                        type='number'
                        // onChange={(e) => {
                        //   formik.handleChange(e)
                        //   const unitPrice = parseFloat(e.target.value)
                        //   const quantity = parseFloat(formik.values.quantity)
                        //   const tva = formik.values.tva
                        //   if (!isNaN(unitPrice) && !isNaN(quantity) && !isNaN(tva)) {
                        //     const totalHT = unitPrice * quantity
                        //     const totalTTC = totalHT * (1 + tva / 100)
                        //     setTotalHT(totalHT)
                        //     setTotalTTC(totalTTC)
                        //     setTotalTTCwt(totalTTC - 1)
                        //   }
                        // }}
                        value={oneProduct?.priceSale?.toFixed(3)}
                        className={clsx('form-control form-control-lg form-control-solid')}
                        disabled={!clientId}
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
                          const unitPrice = parseFloat(oneProduct.priceSale)
                          const tva = formik.values.tva
                          if (!isNaN(unitPrice) && !isNaN(quantity) && !isNaN(tva)) {
                            const totalHT = unitPrice * quantity
                            const totalTTC = totalHT * (1 + tva / 100)
                            setTotalHT(totalHT)
                            setTotalTTC(totalTTC)
                            setTotalTTCwt(totalTTC - 1)
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
                        disabled={!clientId}
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
                          const unitPrice = parseFloat(oneProduct.priceSale)
                          if (!isNaN(unitPrice) && !isNaN(quantity) && !isNaN(tva)) {
                            const totalHT = unitPrice * quantity
                            const totalTTC = totalHT * (1 + tva / 100)
                            setTotalHT(totalHT)
                            setTotalTTC(totalTTC)
                            setTotalTTCwt(totalTTC - 1)
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
                        disabled={!clientId}
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
                        value={totalHT.toFixed(3)}
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
                        value={totalTTCwt.toFixed(3)}
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
              <th className='fw-bold '>Prix vente unitaire HT</th>
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
              <td>{oneProduct?.priceSale?.toFixed(3)} TND</td>
              <td>{formik.values.quantity}</td>
              <td>{totalHT.toFixed(3)} TND</td>
              <td>{totalTTCwt.toFixed(3)} TND</td>
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
                <td className='text-end'>{totalHT.toFixed(3)} TND</td>
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
                <td className='text-end'>{totalTTCwt.toFixed(3)} TND</td>
              </tr>
              <tr>
                <th scope='row' className='fw-bold text-start'>
                  Timbre fiscal
                </th>
                <td className='text-end'>1,000 TND</td>
              </tr>
              <tr>
                <th scope='row' className='fw-bold text-start'>
                  Net à payer
                </th>
                <td className='text-end'>
                  <h4 className='m-0 fw-semibold'>
                    {totalTTC.toFixed(3) !== '0.000' ? totalTTC.toFixed(3) : '1,000'} TND
                  </h4>
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

export {DevisEditModalForm}
