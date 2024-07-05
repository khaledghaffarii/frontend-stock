import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {
  QueryResponseProviderCommande,
  QueryResponseProviderDevis,
  QueryResponseProviderFacture,
  QueryResponseProviderLivraison,
} from './core/QueryResponseProvider'
import {KTCard} from '../../../../../_metronic/helpers'
import {SaleTableFacture} from './table/SaleTableFacture'
import {SaleTableDevis} from './table/SaleTableDevis'
import {SaleTableLivraison} from './table/SaleTableLivraison'
import {SaleTableCommande} from './table/SaleTableCommande'
import {SaleListHeaderFacture} from './components/header/facture/SaleListHeaderFacture'
import {SaleListHeaderDevis} from './components/header/devis/SaleListHeaderDevis'
import {SaleListHeaderCommande} from './components/header/commande/SaleListHeaderCommande'
import {SaleListHeaderLivraison} from './components/header/livraison/SaleListHeaderLivraison'
import {FactureEditModal} from './facture-edit-model/FactureEditModal'
import {DevisEditModal} from './devis-edit-model/DevisEditModal'
import {LivraisonEditModal} from './livraison-edit-modal/LivraisonEditModal'
import {CommandeEditModal} from './commande-edit-modal/CommandeEditModal'

const SaleListFacture = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <KTCard>
        <SaleListHeaderFacture />
        <SaleTableFacture />
      </KTCard>
      {itemIdForUpdate !== undefined && <FactureEditModal />}
    </>
  )
}
const SaleListDevis = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <KTCard>
        <SaleListHeaderDevis />
        <SaleTableDevis />
      </KTCard>
      {itemIdForUpdate !== undefined && <DevisEditModal />}
    </>
  )
}
const SaleListLivraison = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <KTCard>
        <SaleListHeaderLivraison />
        <SaleTableLivraison />
      </KTCard>
      {itemIdForUpdate !== undefined && <LivraisonEditModal />}
    </>
  )
}
const SaleListCommande = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <KTCard>
        <SaleListHeaderCommande />
        <SaleTableCommande />
      </KTCard>
      {itemIdForUpdate !== undefined && <CommandeEditModal />}
    </>
  )
}

const SaleListWrapperCommande = () => (
  <QueryRequestProvider>
    <QueryResponseProviderCommande>
      <ListViewProvider>
        <SaleListCommande />
      </ListViewProvider>
    </QueryResponseProviderCommande>
  </QueryRequestProvider>
)
const SaleListWrapperFacture = () => (
  <QueryRequestProvider>
    <QueryResponseProviderFacture>
      <ListViewProvider>
        <SaleListFacture />
      </ListViewProvider>
    </QueryResponseProviderFacture>
  </QueryRequestProvider>
)
const SaleListWrapperDevis = () => (
  <QueryRequestProvider>
    <QueryResponseProviderDevis>
      <ListViewProvider>
        <SaleListDevis />
      </ListViewProvider>
    </QueryResponseProviderDevis>
  </QueryRequestProvider>
)
const SaleListWrapperLivraison = () => (
  <QueryRequestProvider>
    <QueryResponseProviderLivraison>
      <ListViewProvider>
        <SaleListLivraison />
      </ListViewProvider>
    </QueryResponseProviderLivraison>
  </QueryRequestProvider>
)
export {
  SaleListWrapperFacture,
  SaleListWrapperDevis,
  SaleListWrapperLivraison,
  SaleListWrapperCommande,
}
