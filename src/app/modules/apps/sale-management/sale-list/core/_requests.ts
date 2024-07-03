import axios, {AxiosResponse} from 'axios'
import {ID, Response} from '../../../../../../_metronic/helpers'
import {Sale, SalesQueryResponse} from './_models'

const API_URL = process.env.REACT_APP_API_URL
const Sale_URL = `${API_URL}/sale`

const getSale = (query: string, token: string): Promise<SalesQueryResponse> => {
  return axios
    .get(`${Sale_URL}`, {
      headers: {
        'authorization-token': token,
      },
    })
    .then((res: AxiosResponse<SalesQueryResponse>) => {
      return res.data
    })
}
const getTotalSale = (token: string): Promise<SalesQueryResponse> => {
  return axios
    .get(`${API_URL}/sale-summary`, {
      headers: {
        'authorization-token': token,
      },
    })
    .then((res: AxiosResponse<SalesQueryResponse>) => {
      // console.log('🚀 ~ .then ~ res totalSale:', res)
      return res.data
    })
}
const getSaleById = (id: ID, token: string): Promise<Sale | undefined> => {
  const headers = {
    'authorization-token': token,
  }
  return axios
    .get(`${Sale_URL}/${id}`, {headers})

    .then((response: AxiosResponse<Sale>) => response.data)
    .catch((error) => {
      console.log('Error:', error)
      return undefined
    })
}
const createSale = (Sale: Sale, token: string): Promise<Sale | undefined> => {
  const headers = {
    'authorization-token': token,
  }
  return axios
    .post(Sale_URL, Sale, {headers})
    .then((response: AxiosResponse<Response<Sale>>) => {
      console.log('🚀 ~ file: _requests.ts:41 ~ createGroup ~ response:', response)
      return response.data
    })
    .then((response: Response<Sale>) => response.data)
}
const updateSale = (id: ID, Sale: Sale, token: string): Promise<Sale | undefined> => {
  const headers = {
    'authorization-token': token,
  }
  return axios
    .put(`${Sale_URL}/${id}`, Sale, {headers})
    .then((response: AxiosResponse<Response<Sale>>) => {
      console.log('🚀 ~ file: _requests.ts:41 ~ update Sale service ~ response:', response)
      return response.data
    })
    .then((response: Response<Sale>) => response.data)
}
const deleteSale = (SaleId: Array<ID>, token: string): Promise<void> => {
  const headers = {
    'authorization-token': token,
  }
  const requests = SaleId.map((id) => axios.delete(`${Sale_URL}/${id}`, {headers}))
  return axios.all(requests).then(() => {})
}
const createMultipleSales = (file: File, token: string): Promise<Sale | undefined> => {
  const formData = new FormData()
  formData.append('file', file)

  const headers = {
    'authorization-token': token,
  }
  //@ts-ignore
  return axios
    .post(`${Sale_URL}/upload`, formData, {headers})
    .then((response: AxiosResponse<Response<Sale | undefined>>) => {
      console.log('🚀 ~ file: _requests.ts:73 ~ createMultipleSales ~ response:', response)
      return response.data
    })
    .then((response: Response<Sale | undefined>) => response.data)
    .catch((error) => {
      console.error('Erreur lors de la création des Sales:', error)
      return [] // Retourner un tableau vide en cas d'erreur
    })
}

export {getSale, getTotalSale, deleteSale, getSaleById, createSale, updateSale, createMultipleSales}
