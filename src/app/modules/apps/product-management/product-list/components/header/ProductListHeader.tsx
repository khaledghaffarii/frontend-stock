import {useListView} from '../../core/ListViewProvider'
import {ProductListToolbar} from './ProductListToolbar'
import {ProductListGrouping} from './ProductListGrouping'
import {ProductListSearchComponent} from './ProductListSearchComponent'

const ProductListHeader = () => {
  const {selected} = useListView()
  return (
    <div className='card-header border-0 pt-6   justify-content-between'>
      <ProductListSearchComponent />

      <div className='card-toolbar'>
        {selected.length > 0 ? <ProductListGrouping /> : <ProductListToolbar />}
      </div>
    </div>
  )
}

export {ProductListHeader}
