import {useQuery} from 'react-query'

import {isNotEmpty, QUERIES} from '../../../../../../_metronic/helpers'
import {useListView} from '../core/ListViewProvider'
import {getSaleById} from '../core/_requests'
import {useAuth} from '../../../../auth'
import {LivraisonEditModalForm} from './LivraisonEditModalForm'

const LivraisonEditModalFormWrapper = () => {
  const {currentUser, auth} = useAuth()
  //@ts-ignore
  const token: string = auth?.token
  const {itemIdForUpdate, setItemIdForUpdate} = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)
  const {
    isLoading,
    data: sale,
    error,
  } = useQuery(
    `${QUERIES.SALE_LIST}-user-${itemIdForUpdate}`,
    () => {
      if (itemIdForUpdate && token) {
        return getSaleById(itemIdForUpdate, token)
      }
      return Promise.reject('Item ID or token is missing')
    },
    {
      cacheTime: 0,
      enabled: enabledQuery,
      onError: (err) => {
        setItemIdForUpdate(undefined)
        console.error(err)
      },
    }
  )
  if (!itemIdForUpdate) {
    //@ts-ignore
    return <LivraisonEditModalForm isUserLoading={isLoading} sale={{id: undefined}} />
  }

  if (!isLoading && !error && sale) {
    return <LivraisonEditModalForm isUserLoading={isLoading} sale={sale} />
  }

  return null
}

export {LivraisonEditModalFormWrapper}
