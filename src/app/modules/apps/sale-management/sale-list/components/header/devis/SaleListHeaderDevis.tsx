import {useListView} from '../../../core/ListViewProvider'
import {SaleListGroupingDevis} from './SaleListGroupingDevis'
import {SaleListSearchDevis} from './SaleListSearchDevis'

import {SaleListToolbarDevis} from './SaleListToolbarDevis'

const SaleListHeaderDevis = () => {
  const {selected} = useListView()
  return (
    <div className='card-header border-0 pt-6   justify-content-between'>
      <SaleListSearchDevis />

      <div className='card-toolbar'>
        {selected.length > 0 ? <SaleListGroupingDevis /> : <SaleListToolbarDevis />}
      </div>
    </div>
  )
}

export {SaleListHeaderDevis}
