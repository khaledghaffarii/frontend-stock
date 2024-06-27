import axios, {AxiosResponse} from 'axios'
import {ID, Response} from '../../../../../../_metronic/helpers'
import {Achat, AchatsQueryResponse} from './_models'

const API_URL = process.env.REACT_APP_API_URL
const Achat_URL = `${API_URL}/purchase`

const getAchat = (query: string, token: string): Promise<AchatsQueryResponse> => {
  return axios
    .get(`${Achat_URL}`, {
      headers: {
        'authorization-token': token,
      },
    })
    .then((res: AxiosResponse<AchatsQueryResponse>) => {
      return res.data
    })
}
const getTotalAchat = (token: string): Promise<AchatsQueryResponse> => {
  return axios
    .get(`${API_URL}/purchase-summary`, {
      headers: {
        'authorization-token': token,
      },
    })
    .then((res: AxiosResponse<AchatsQueryResponse>) => {
      // console.log('🚀 ~ .then ~ res totalAchat:', res)
      return res.data
    })
}
const getAchatById = (id: ID, token: string): Promise<Achat | undefined> => {
  const headers = {
    'authorization-token': token,
  }
  return axios
    .get(`${Achat_URL}/${id}`, {headers})

    .then((response: AxiosResponse<Achat>) => response.data)
    .catch((error) => {
      console.log('Error:', error)
      return undefined
    })
}
const createAchat = (Achat: Achat, token: string): Promise<Achat | undefined> => {
  const headers = {
    'authorization-token': token,
  }
  return axios
    .post(Achat_URL, Achat, {headers})
    .then((response: AxiosResponse<Response<Achat>>) => {
      //console.log('🚀 ~ file: _requests.ts:41 ~ createGroup ~ response:', response)
      return response.data
    })
    .then((response: Response<Achat>) => response.data)
}
const updateAchat = (id: ID, Achat: Achat, token: string): Promise<Achat | undefined> => {
  const headers = {
    'authorization-token': token,
  }
  return axios
    .put(`${Achat_URL}/${id}`, Achat, {headers})
    .then((response: AxiosResponse<Response<Achat>>) => {
      console.log('🚀 ~ file: _requests.ts:41 ~ update Achat service ~ response:', response)
      return response.data
    })
    .then((response: Response<Achat>) => response.data)
}
const deleteAchat = (AchatId: Array<ID>, token: string): Promise<void> => {
  const headers = {
    'authorization-token': token,
  }
  const requests = AchatId.map((id) => axios.delete(`${Achat_URL}/${id}`, {headers}))
  return axios.all(requests).then(() => {})
}
const createMultipleAchats = (file: File, token: string): Promise<Achat | undefined> => {
  const formData = new FormData()
  formData.append('file', file)

  const headers = {
    'authorization-token': token,
  }
  //@ts-ignore
  return axios
    .post(`${Achat_URL}/upload`, formData, {headers})
    .then((response: AxiosResponse<Response<Achat | undefined>>) => {
      console.log('🚀 ~ file: _requests.ts:73 ~ createMultipleAchats ~ response:', response)
      return response.data
    })
    .then((response: Response<Achat | undefined>) => response.data)
    .catch((error) => {
      console.error('Erreur lors de la création des Achats:', error)
      return [] // Retourner un tableau vide en cas d'erreur
    })
}

export {
  getAchat,
  getTotalAchat,
  deleteAchat,
  getAchatById,
  createAchat,
  updateAchat,
  createMultipleAchats,
}
