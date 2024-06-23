import {ID, Response} from '../../../../../../_metronic/helpers'

export type Client = {
  address?: string
  createdAt?: Date
  email?: string
  company?: string
  fullname?: string
  id?: ID
  status?: string
  phone?: string
  updatedAt?: Date
}
export type ClientsQueryResponse = Response<Array<Client>>
