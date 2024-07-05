import {useListView} from '../../../core/ListViewProvider'
import {SaleListToolbarFacture} from './SaleListToolbarFacture'
import {SaleListGroupingFacture} from './SaleListGroupingFacture'
import {SaleListSearchFacture} from './SaleListSearchFacture'

const SaleListHeaderFacture = () => {
  const {selected} = useListView()
  return (
    <div className='card-header border-0 pt-6   justify-content-between'>
      <SaleListSearchFacture />

      <div className='card-toolbar'>
        {selected.length > 0 ? <SaleListGroupingFacture /> : <SaleListToolbarFacture />}
      </div>
    </div>
  )
}

export {SaleListHeaderFacture}
