import {useListView} from '../../core/ListViewProvider'
import {ClientListToolbar} from './ClientListToolbar'
import {ClientListGrouping} from './ClientListGrouping'
import {ClientListSearchComponent} from './ClientListSearchComponent'

const ClientsListHeader = () => {
  const {selected} = useListView()
  return (
    <div className='card-header border-0 pt-6   justify-content-between'>
      <ClientListSearchComponent />

      <div className='card-toolbar'>
        {selected.length > 0 ? <ClientListGrouping /> : <ClientListToolbar />}
      </div>
    </div>
  )
}

export {ClientsListHeader}
