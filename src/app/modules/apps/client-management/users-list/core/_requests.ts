import axios, {AxiosResponse} from 'axios'
import {ID, Response} from '../../../../../../_metronic/helpers'
import {Client, ClientsQueryResponse} from './_models'

const API_URL = process.env.REACT_APP_API_URL
const CLIENT_URL = `${API_URL}/clients`

const getClient = (query: string, token: string): Promise<ClientsQueryResponse> => {
  return axios
    .get(`${CLIENT_URL}`, {
      headers: {
        'authorization-token': token,
      },
    })
    .then((res: AxiosResponse<ClientsQueryResponse>) => {
      return res.data
    })
}
const getTotalClient = (token: string): Promise<ClientsQueryResponse> => {
  return axios
    .get(`${API_URL}/total-clients`, {
      headers: {
        'authorization-token': token,
      },
    })
    .then((res: AxiosResponse<ClientsQueryResponse>) => {
      // console.log('🚀 ~ .then ~ res totalClient:', res)
      return res.data
    })
}
const getClientById = (id: ID, token: string): Promise<Client | undefined> => {
  const headers = {
    'authorization-token': token,
  }
  return axios
    .get(`${CLIENT_URL}/${id}`, {headers})

    .then((response: AxiosResponse<Client>) => response.data)
    .catch((error) => {
      console.log('Error:', error)
      return undefined
    })
}
const createClient = (client: Client, token: string): Promise<Client | undefined> => {
  const headers = {
    'authorization-token': token,
  }
  return axios
    .post(CLIENT_URL, client, {headers})
    .then((response: AxiosResponse<Response<Client>>) => {
      //console.log('🚀 ~ file: _requests.ts:41 ~ createGroup ~ response:', response)
      return response.data
    })
    .then((response: Response<Client>) => response.data)
}
const updateClient = (id: ID, client: Client, token: string): Promise<Client | undefined> => {
  const headers = {
    'authorization-token': token,
  }
  return axios
    .put(`${CLIENT_URL}/${id}`, client, {headers})
    .then((response: AxiosResponse<Response<Client>>) => {
      // console.log('🚀 ~ file: _requests.ts:41 ~ createGroup ~ response:', response)
      return response.data
    })
    .then((response: Response<Client>) => response.data)
}
const deleteClient = (clientId: Array<ID>, token: string): Promise<void> => {
  const headers = {
    'authorization-token': token,
  }
  const requests = clientId.map((id) => axios.delete(`${CLIENT_URL}/${id}`, {headers}))
  return axios.all(requests).then(() => {})
}
const createMultipleClients = (file: File, token: string): Promise<Client | undefined> => {
  const formData = new FormData()
  formData.append('file', file)

  const headers = {
    'authorization-token': token,
  }
  //@ts-ignore
  return axios
    .post(`${CLIENT_URL}/upload`, formData, {headers})
    .then((response: AxiosResponse<Response<Client | undefined>>) => {
      console.log('🚀 ~ file: _requests.ts:73 ~ createMultipleClients ~ response:', response)
      return response.data
    })
    .then((response: Response<Client | undefined>) => response.data)
    .catch((error) => {
      console.error('Erreur lors de la création des clients:', error)
      return [] // Retourner un tableau vide en cas d'erreur
    })
}

export {
  getClient,
  getTotalClient,
  deleteClient,
  getClientById,
  createClient,
  updateClient,
  createMultipleClients,
}
