import {useListView} from '../../core/ListViewProvider'
import {SaleListToolbar} from './SaleListToolbar'
import {SaleListGrouping} from './SaleListGrouping'
import {SaleListSearchComponent} from './SaleListSearchComponent'

const SaleListHeader = () => {
  const {selected} = useListView()
  return (
    <div className='card-header border-0 pt-6   justify-content-between'>
      <SaleListSearchComponent />

      <div className='card-toolbar'>
        {selected.length > 0 ? <SaleListGrouping /> : <SaleListToolbar />}
      </div>
    </div>
  )
}

export {SaleListHeader}
