import axios, {AxiosResponse} from 'axios'
import {ID, Response} from '../../../../../../_metronic/helpers'
import {Category, CategorysQueryResponse} from './_models'

const API_URL = process.env.REACT_APP_API_URL
const Category_URL = `${API_URL}/category`

const getCategory = (query: string, token: string): Promise<CategorysQueryResponse> => {
  return axios
    .get(`${Category_URL}`, {
      headers: {
        'authorization-token': token,
      },
    })
    .then((res: AxiosResponse<CategorysQueryResponse>) => {
      return res.data
    })
}
const getTotalCategory = (token: string): Promise<CategorysQueryResponse> => {
  return axios
    .get(`${API_URL}/total-category`, {
      headers: {
        'authorization-token': token,
      },
    })
    .then((res: AxiosResponse<CategorysQueryResponse>) => {
      // console.log('🚀 ~ .then ~ res totalCategory:', res)
      return res.data
    })
}
const getCategoryById = (id: ID, token: string): Promise<Category | undefined> => {
  const headers = {
    'authorization-token': token,
  }
  return axios
    .get(`${Category_URL}/${id}`, {headers})

    .then((response: AxiosResponse<Category>) => response.data)
    .catch((error) => {
      console.log('Error:', error)
      return undefined
    })
}
const createCategory = (Category: Category, token: string): Promise<Category | undefined> => {
  const headers = {
    'authorization-token': token,
  }
  return axios
    .post(Category_URL, Category, {headers})
    .then((response: AxiosResponse<Response<Category>>) => {
      //console.log('🚀 ~ file: _requests.ts:41 ~ createGroup ~ response:', response)
      return response.data
    })
    .then((response: Response<Category>) => response.data)
}
const updateCategory = (
  id: ID,
  Category: Category,
  token: string
): Promise<Category | undefined> => {
  const headers = {
    'authorization-token': token,
  }
  return axios
    .put(`${Category_URL}/${id}`, Category, {headers})
    .then((response: AxiosResponse<Response<Category>>) => {
      // console.log('🚀 ~ file: _requests.ts:41 ~ createGroup ~ response:', response)
      return response.data
    })
    .then((response: Response<Category>) => response.data)
}
const deleteCategory = (CategoryId: Array<ID>, token: string): Promise<void> => {
  const headers = {
    'authorization-token': token,
  }
  const requests = CategoryId.map((id) => axios.delete(`${Category_URL}/${id}`, {headers}))
  return axios.all(requests).then(() => {})
}
const createMultipleCategorys = (file: File, token: string): Promise<Category | undefined> => {
  const formData = new FormData()
  formData.append('file', file)

  const headers = {
    'authorization-token': token,
  }
  //@ts-ignore
  return axios
    .post(`${Category_URL}/upload`, formData, {headers})
    .then((response: AxiosResponse<Response<Category | undefined>>) => {
      console.log('🚀 ~ file: _requests.ts:73 ~ createMultipleCategorys ~ response:', response)
      return response.data
    })
    .then((response: Response<Category | undefined>) => response.data)
    .catch((error) => {
      console.error('Erreur lors de la création des Categorys:', error)
      return [] // Retourner un tableau vide en cas d'erreur
    })
}

export {
  getCategory,
  getTotalCategory,
  deleteCategory,
  getCategoryById,
  createCategory,
  updateCategory,
  createMultipleCategorys,
}
