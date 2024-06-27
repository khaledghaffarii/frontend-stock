import {useListView} from '../../core/ListViewProvider'
import {AchatListToolbar} from './AchatListToolbar'
import {AchatListGrouping} from './AchatListGrouping'
import {AchatListSearchComponent} from './AchatListSearchComponent'

const AchatListHeader = () => {
  const {selected} = useListView()
  return (
    <div className='card-header border-0 pt-6   justify-content-between'>
      <AchatListSearchComponent />

      <div className='card-toolbar'>
        {selected.length > 0 ? <AchatListGrouping /> : <AchatListToolbar />}
      </div>
    </div>
  )
}

export {AchatListHeader}
