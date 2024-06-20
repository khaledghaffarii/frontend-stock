import {ID, Response} from '../../../../../../_metronic/helpers'

export type Client = {
  address?: string
  createdAt?: Date
  email?: string
  fullname?: string
  id?: ID
  status?: string
  telephone?: string
  updatedAt?: Date
}
export type ClientsQueryResponse = Response<Array<Client>>
