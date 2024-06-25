import {ID, Response} from '../../../../../../_metronic/helpers'

export type Category = {
  id?: ID
  name?: string
  createdAt?: Date
  updatedAt?: Date
}
export type CategorysQueryResponse = Response<Array<Category>>
