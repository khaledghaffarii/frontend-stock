import {useQuery} from 'react-query'
import {ClientEditModalForm} from './ClientEditModalForm'
import {isNotEmpty, QUERIES} from '../../../../../../_metronic/helpers'
import {useListView} from '../core/ListViewProvider'
import {getClientById} from '../core/_requests'
import {useAuth} from '../../../../auth'

const ClientEditModalFormWrapper = () => {
  const {currentUser, auth} = useAuth()
  //@ts-ignore
  const token: string = auth?.token
  const {itemIdForUpdate, setItemIdForUpdate} = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)
  const {
    isLoading,
    data: client,
    error,
  } = useQuery(
    `${QUERIES.USERS_LIST}-user-${itemIdForUpdate}`,
    () => {
      if (itemIdForUpdate && token) {
        return getClientById(itemIdForUpdate, token)
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
    return <ClientEditModalForm isUserLoading={isLoading} client={{id: undefined}} />
  }

  if (!isLoading && !error && client) {
    return <ClientEditModalForm isUserLoading={isLoading} client={client} />
  }

  return null
}

export {ClientEditModalFormWrapper}

// const {
//   isLoading,
//   data: client,
//   error,
// } = useQuery(
//   `${QUERIES.USERS_LIST}-user-${itemIdForUpdate}`,
//   () => {
//     return getClientById(itemIdForUpdate, token))
//   },
//   {
//     cacheTime: 0,
//     enabled: enabledQuery,
//     onError: (err) => {
//       setItemIdForUpdate(undefined)
//       console.error(err)
//     },
//   }
// )
