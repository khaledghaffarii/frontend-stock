import axios, {AxiosResponse} from 'axios'
import {ID, Response} from '../../../../../../_metronic/helpers'
import {Supplier, SuppliersQueryResponse} from './_models'

const API_URL = process.env.REACT_APP_API_URL
const Supplier_URL = `${API_URL}/suppliers`

const getSupplier = (query: string, token: string): Promise<SuppliersQueryResponse> => {
  return axios
    .get(`${Supplier_URL}`, {
      headers: {
        'authorization-token': token,
      },
    })
    .then((res: AxiosResponse<SuppliersQueryResponse>) => {
      console.log('🚀 ~ .then ~ res:', res)
      return res.data
    })
}
const getTotalSupplier = (token: string): Promise<SuppliersQueryResponse> => {
  return axios
    .get(`${API_URL}/total-suppliers`, {
      headers: {
        'authorization-token': token,
      },
    })
    .then((res: AxiosResponse<SuppliersQueryResponse>) => {
      // console.log('🚀 ~ .then ~ res totalSupplier:', res)
      return res.data
    })
}
const getSupplierById = (id: ID, token: string): Promise<Supplier | undefined> => {
  const headers = {
    'authorization-token': token,
  }
  return axios
    .get(`${Supplier_URL}/${id}`, {headers})

    .then((response: AxiosResponse<Supplier>) => response.data)
    .catch((error) => {
      console.log('Error:', error)
      return undefined
    })
}
const createSupplier = (Supplier: Supplier, token: string): Promise<Supplier | undefined> => {
  const headers = {
    'authorization-token': token,
  }
  return axios
    .post(Supplier_URL, Supplier, {headers})
    .then((response: AxiosResponse<Response<Supplier>>) => {
      //console.log('🚀 ~ file: _requests.ts:41 ~ createGroup ~ response:', response)
      return response.data
    })
    .then((response: Response<Supplier>) => response.data)
}
const updateSupplier = (
  id: ID,
  Supplier: Supplier,
  token: string
): Promise<Supplier | undefined> => {
  const headers = {
    'authorization-token': token,
  }
  return axios
    .put(`${Supplier_URL}/${id}`, Supplier, {headers})
    .then((response: AxiosResponse<Response<Supplier>>) => {
      // console.log('🚀 ~ file: _requests.ts:41 ~ createGroup ~ response:', response)
      return response.data
    })
    .then((response: Response<Supplier>) => response.data)
}
const deleteSupplier = (SupplierId: Array<ID>, token: string): Promise<void> => {
  const headers = {
    'authorization-token': token,
  }
  const requests = SupplierId.map((id) => axios.delete(`${Supplier_URL}/${id}`, {headers}))
  return axios.all(requests).then(() => {})
}
const createMultipleSuppliers = (file: File, token: string): Promise<Supplier | undefined> => {
  const formData = new FormData()
  formData.append('file', file)

  const headers = {
    'authorization-token': token,
  }
  //@ts-ignore
  return axios
    .post(`${Supplier_URL}/upload`, formData, {headers})
    .then((response: AxiosResponse<Response<Supplier | undefined>>) => {
      console.log('🚀 ~ file: _requests.ts:73 ~ createMultipleSuppliers ~ response:', response)
      return response.data
    })
    .then((response: Response<Supplier | undefined>) => response.data)
    .catch((error) => {
      console.error('Erreur lors de la création des Suppliers:', error)
      return [] // Retourner un tableau vide en cas d'erreur
    })
}

export {
  getSupplier,
  getTotalSupplier,
  deleteSupplier,
  getSupplierById,
  createSupplier,
  updateSupplier,
  createMultipleSuppliers,
}
