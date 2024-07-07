import React, {useEffect, useState} from 'react'

import axios from 'axios'
import {ID, KTCard} from '../../../../_metronic/helpers'
import {getPurchaseByProduct, getSaleByProduct} from './product-list/core/_requests'
import {useAuth} from '../../auth'
import {Sale} from '../sale-management/sale-list/core/_models'
import {Achat} from '../achat-management/achat-list/core/_models'
import moment from 'moment'
import {useNavigate} from 'react-router-dom'

const Purchase_URL = 'your-purchase-url'
const Sale_URL = 'your-sale-url'

type Props = {
  id: any
}

const ProductRapportView: React.FC<Props> = ({id}) => {
  const {currentUser, logout} = useAuth()
  console.log('🚀 ~ currentUser:', currentUser)
  const [purchases, setPurchases] = useState<Achat[] | undefined>(undefined)
  const [sales, setSales] = useState<Sale[] | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)
  const {auth} = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    const token: any = auth?.token
    getPurchaseByProduct(id, token)
      .then((data: any) => {
        console.log('🚀 ~ .getPurchaseByProduct ~ data:', data)
        if (data) {
          setPurchases(data?.data)
        } else {
          setError('No purchases found for this product')
        }
      })
      .catch((err) => setError(err.message))

    getSaleByProduct(id, token)
      .then((data: any) => {
        console.log('🚀 ~ .getSaleByProduct ~ data:', data)
        if (data) {
          setSales(data?.data)
        } else {
          setError('No sales found for this product')
        }
      })
      .catch((err) => setError(err.message))
  }, [id])

  const movements = [
    ...(purchases || []).map((purchase) => ({
      id: purchase.id,
      date: new Date(purchase.createdAt!).toLocaleDateString(),
      document: purchase.refInvoice,
      etat: 'achat',
      contact: purchase?.supplier?.fullname,
      utilisateur: currentUser?.email,
      quantiteEntrante: purchase.quantity,
      quantiteSortante: 0,
      enStock: purchase.product?.quantity,
      entrepot: 'N/A',
      type: 'achat',
    })),
    ...(sales || []).map((sale) => ({
      id: sale.id,
      date: sale?.saleDate,
      document: sale.refInvoice,
      etat: sale.status,
      contact: sale?.client?.fullname,
      utilisateur: currentUser?.email,
      quantiteEntrante: 0,
      quantiteSortante: sale.quantity,
      enStock: sale.product_id?.quantity,
      entrepot: 'N/A',
      type:
        sale.status === 'Facture'
          ? 'facture'
          : sale.status === 'Devis'
          ? 'devis'
          : sale.status === 'Bon de commande'
          ? 'commande'
          : sale.status === 'Bon de livraison'
          ? 'livraison'
          : '',
    })),
  ]

  const handleDocumentClick = (type: string, documentId: string) => {
    let basePath = ''

    switch (type) {
      case 'facture':
        basePath = '/apps/sale-management/sale/facture/view/'
        break
      case 'devis':
        basePath = '/apps/sale-management/sale/devis/view/'
        break
      case 'livraison':
        basePath = '/apps/sale-management/sale/livraison/view/'
        break
      case 'commande':
        basePath = '/apps/sale-management/sale/commande/view/'
        break
      case 'achat':
        basePath = '/apps/achat-management/achat/view/'
        break
      default:
        return
    }

    navigate(`${basePath}${documentId}`)
  }
  return (
    <div style={{marginTop: '20px'}}>
      <KTCard>
        <div className='card mt-12 p-8 table-responsive text-center'>
          <table className='table table-striped table-hover'>
            <thead>
              <tr>
                <th className='fw-bold' scope='col'>
                  DATE
                </th>
                <th scope='col' className='fw-bold'>
                  DOCUMENT
                </th>
                <th scope='col' className='fw-bold'>
                  ÉTAT
                </th>
                <th scope='col' className='fw-bold'>
                  CONTACT
                </th>
                <th scope='col' className='fw-bold'>
                  UTILISATEUR
                </th>
                <th scope='col' className='fw-bold'>
                  QUANTITÉ ENTRANTE
                </th>
                <th scope='col' className='fw-bold'>
                  QUANTITÉ SORTANTE
                </th>

                <th scope='col' className='fw-bold'>
                  ENTREPÔT
                </th>
              </tr>
            </thead>
            <tbody>
              {movements.length > 0 ? (
                movements.map((movement: any, index) => (
                  <tr key={index}>
                    <td className='text-start'>
                      {moment(movement.date).format('DD MMMM YYYY, HH:mm')}
                    </td>
                    <td
                      className='text-primary mt-3'
                      style={{cursor: 'pointer'}}
                      onClick={() => handleDocumentClick(movement?.type, movement?.id)}
                    >
                      {movement.document}
                    </td>
                    <td>{movement.etat}</td>
                    <td>{movement?.contact}</td>
                    <td>{movement?.utilisateur}</td>
                    <td>{movement.quantiteEntrante}</td>
                    <td>{movement.quantiteSortante}</td>
                    <td>{movement.entrepot}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className='text-center mt-8'>
                    Il n'y a pas de données à afficher
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </KTCard>
    </div>
  )
}

export default ProductRapportView
