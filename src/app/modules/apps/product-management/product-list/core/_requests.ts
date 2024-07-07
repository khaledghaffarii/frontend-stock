import axios, {AxiosResponse} from 'axios'
import {ID, Response} from '../../../../../../_metronic/helpers'
import {Product, ProductsQueryResponse} from './_models'

const API_URL = process.env.REACT_APP_API_URL
const Product_URL = `${API_URL}/products`
const Purchase_URL = `${API_URL}/purchase`
const Sale_URL = `${API_URL}/sales`
const getProduct = (query: string, token: string): Promise<ProductsQueryResponse> => {
  return axios
    .get(`${Product_URL}`, {
      headers: {
        'authorization-token': token,
      },
    })
    .then((res: AxiosResponse<ProductsQueryResponse>) => {
      return res.data
    })
}
const getTotalProduct = (token: string): Promise<ProductsQueryResponse> => {
  return axios
    .get(`${API_URL}/total-products`, {
      headers: {
        'authorization-token': token,
      },
    })
    .then((res: AxiosResponse<ProductsQueryResponse>) => {
      // console.log('🚀 ~ .then ~ res totalProduct:', res)
      return res.data
    })
}
const getProductById = (id: ID, token: string): Promise<Product | undefined> => {
  const headers = {
    'authorization-token': token,
  }
  return axios
    .get(`${Product_URL}/${id}`, {headers})

    .then((response: AxiosResponse<Product>) => response.data)
    .catch((error) => {
      console.log('Error:', error)
      return undefined
    })
}
const getPurchaseByProduct = (id: ID, token: string): Promise<Product | undefined> => {
  const headers = {
    'authorization-token': token,
  }
  return axios
    .get(`${Purchase_URL}/product/${id}`, {headers})
    .then((response: AxiosResponse<Product>) => response.data)
    .catch((error) => {
      console.log('Error:', error)
      return undefined
    })
}
const getSaleByProduct = (id: ID, token: string): Promise<Product | undefined> => {
  const headers = {
    'authorization-token': token,
  }
  return axios
    .get(`${Sale_URL}/product/${id}`, {headers})
    .then((response: AxiosResponse<Product>) => response.data)
    .catch((error) => {
      console.log('Error:', error)
      return undefined
    })
}
const createProduct = (Product: Product, token: string): Promise<Product | undefined> => {
  const headers = {
    'authorization-token': token,
  }
  return axios
    .post(Product_URL, Product, {headers})
    .then((response: AxiosResponse<Response<Product>>) => {
      //console.log('🚀 ~ file: _requests.ts:41 ~ createGroup ~ response:', response)
      return response.data
    })
    .then((response: Response<Product>) => response.data)
}
const updateProduct = (id: ID, Product: Product, token: string): Promise<Product | undefined> => {
  const headers = {
    'authorization-token': token,
  }
  return axios
    .put(`${Product_URL}/${id}`, Product, {headers})
    .then((response: AxiosResponse<Response<Product>>) => {
      console.log('🚀 ~ file: _requests.ts:41 ~ update product service ~ response:', response)
      return response.data
    })
    .then((response: Response<Product>) => response.data)
}
const deleteProduct = (ProductId: Array<ID>, token: string): Promise<void> => {
  const headers = {
    'authorization-token': token,
  }
  const requests = ProductId.map((id) => axios.delete(`${Product_URL}/${id}`, {headers}))
  return axios.all(requests).then(() => {})
}
const createMultipleProducts = (file: File, token: string): Promise<Product | undefined> => {
  const formData = new FormData()
  formData.append('file', file)

  const headers = {
    'authorization-token': token,
  }
  //@ts-ignore
  return axios
    .post(`${Product_URL}/upload`, formData, {headers})
    .then((response: AxiosResponse<Response<Product | undefined>>) => {
      console.log('🚀 ~ file: _requests.ts:73 ~ createMultipleProducts ~ response:', response)
      return response.data
    })
    .then((response: Response<Product | undefined>) => response.data)
    .catch((error) => {
      console.error('Erreur lors de la création des Products:', error)
      return [] // Retourner un tableau vide en cas d'erreur
    })
}

export {
  getPurchaseByProduct,
  getSaleByProduct,
  getProduct,
  getTotalProduct,
  deleteProduct,
  getProductById,
  createProduct,
  updateProduct,
  createMultipleProducts,
}
