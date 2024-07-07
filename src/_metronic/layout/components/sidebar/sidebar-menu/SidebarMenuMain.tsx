/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import {useIntl} from 'react-intl'
import {KTSVG} from '../../../../helpers'
import {SidebarMenuItemWithSub} from './SidebarMenuItemWithSub'
import {SidebarMenuItem} from './SidebarMenuItem'

const SidebarMenuMain = () => {
  const intl = useIntl()

  return (
    <>
      <SidebarMenuItem
        to='/dashboard'
        icon='/media/icons/duotune/art/art002.svg'
        title='Tableau de board'
        fontIcon='bi-app-indicator'
      />
      {/* <SidebarMenuItem
        to='/builder'
        icon='/media/icons/duotune/general/gen019.svg'
        title='Layout Builder'
        fontIcon='bi-layers'
      /> */}
      {/* <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Crafted</span>
        </div>
      </div>
      <SidebarMenuItemWithSub
        to='/crafted/pages'
        title='Pages'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/general/gen022.svg'
      >
        <SidebarMenuItemWithSub to='/crafted/pages/profile' title='Profile' hasBullet={true}>
          <SidebarMenuItem to='/crafted/pages/profile/overview' title='Overview' hasBullet={true} />
          <SidebarMenuItem to='/crafted/pages/profile/projects' title='Projects' hasBullet={true} />
          <SidebarMenuItem
            to='/crafted/pages/profile/campaigns'
            title='Campaigns'
            hasBullet={true}
          />
          <SidebarMenuItem
            to='/crafted/pages/profile/documents'
            title='Documents'
            hasBullet={true}
          />
          <SidebarMenuItem
            to='/crafted/pages/profile/connections'
            title='Connections'
            hasBullet={true}
          />
        </SidebarMenuItemWithSub>

        <SidebarMenuItemWithSub to='/crafted/pages/wizards' title='Wizards' hasBullet={true}>
          <SidebarMenuItem
            to='/crafted/pages/wizards/horizontal'
            title='Horizontal'
            hasBullet={true}
          />
          <SidebarMenuItem to='/crafted/pages/wizards/vertical' title='Vertical' hasBullet={true} />
        </SidebarMenuItemWithSub>
      </SidebarMenuItemWithSub>
      <SidebarMenuItemWithSub
        to='/crafted/accounts'
        title='Accounts'
        icon='/media/icons/duotune/communication/com006.svg'
        fontIcon='bi-person'
      >
        <SidebarMenuItem to='/crafted/account/overview' title='Overview' hasBullet={true} />
        <SidebarMenuItem to='/crafted/account/settings' title='Settings' hasBullet={true} />
      </SidebarMenuItemWithSub>
      <SidebarMenuItemWithSub
        to='/error'
        title='Errors'
        fontIcon='bi-sticky'
        icon='/media/icons/duotune/general/gen040.svg'
      >
        <SidebarMenuItem to='/error/404' title='Error 404' hasBullet={true} />
        <SidebarMenuItem to='/error/500' title='Error 500' hasBullet={true} />
      </SidebarMenuItemWithSub>
      <SidebarMenuItemWithSub
        to='/crafted/widgets'
        title='Widgets'
        icon='/media/icons/duotune/general/gen025.svg'
        fontIcon='bi-layers'
      >
        <SidebarMenuItem to='/crafted/widgets/lists' title='Lists' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/statistics' title='Statistics' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/charts' title='Charts' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/mixed' title='Mixed' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/tables' title='Tables' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/feeds' title='Feeds' hasBullet={true} />
      </SidebarMenuItemWithSub> */}
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Contacts</span>
        </div>
      </div>
      <SidebarMenuItem
        to='/apps/client-management/clients'
        icon='/media/icons/duotune/communication/com006.svg'
        title='Gestion des clients'
        fontIcon='bi-layers'
      />
      <SidebarMenuItem
        to='/apps/supplier-management/suppliers'
        icon='/media/icons/duotune/finance/fin006.svg'
        title='Gestion des fournisseurs'
        fontIcon='bi-layers'
      />
      {/* <SidebarMenuItemWithSub
        to='/apps/chat'
        title='Chat'
        fontIcon='bi-chat-left'
        icon='/media/icons/duotune/communication/com012.svg'
      >
        <SidebarMenuItem to='/apps/chat/private-chat' title='Private Chat' hasBullet={true} />
        <SidebarMenuItem to='/apps/chat/group-chat' title='Group Chart' hasBullet={true} />
        <SidebarMenuItem to='/apps/chat/drawer-chat' title='Drawer Chart' hasBullet={true} />
      </SidebarMenuItemWithSub> */}
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Stock</span>
        </div>
      </div>
      <SidebarMenuItemWithSub
        to='/apps/product-management'
        title='Produit et service'
        fontIcon='bi-chat-left'
        icon='/media/icons/duotune/user/product.svg'
      >
        <SidebarMenuItem
          to='/apps/category-management/category'
          title='Catégories'
          hasBullet={false}
          icon='/media/icons/duotune/user/category.svg'
        />
        <SidebarMenuItem
          to='apps/product-management/product'
          title='Produits'
          icon='/media/icons/duotune/user/product2.svg'
          hasBullet={false}
        />
      </SidebarMenuItemWithSub>
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>
            Mouvements de Stock
          </span>
        </div>
      </div>
      <SidebarMenuItemWithSub
        to='/apps/achat-management'
        title='Gestion des achats'
        fontIcon='bi-chat-left'
        icon='/media/icons/duotune/user/purchase.svg'
      >
        <SidebarMenuItem
          to='/apps/achat-management/achat'
          title='Facture fournisseur
'
          icon='/media/icons/duotune/user/invoice.svg'
        />
      </SidebarMenuItemWithSub>
      <SidebarMenuItemWithSub
        to='/apps/sale-management'
        title='Gestion des ventes'
        fontIcon='bi-chat-left'
        icon='/media/icons/duotune/user/sale.svg'
      >
        <SidebarMenuItem
          to='apps/sale-management/sale/facture'
          title='Facture '
          hasBullet={true}
          // icon='/media/icons/duotune/user/facture.svg'
        />
        <SidebarMenuItem
          to='apps/sale-management/sale/devis'
          title='Devis '
          hasBullet={true}
          //icon='/media/icons/duotune/user/invoice.svg'
        />
        <SidebarMenuItem
          to='/apps/sale-management/sale/livraison'
          title='Bon de livraison '
          hasBullet={true}
          //icon='/media/icons/duotune/user/invoice.svg'
        />
        <SidebarMenuItem
          to='/apps/sale-management/sale/commande'
          title='Bon de commande '
          hasBullet={true}
          // icon='/media/icons/duotune/general/gen029.svg'
        />
      </SidebarMenuItemWithSub>
      {/* <SidebarMenuItem
        to='/apps/user-management/users'
        icon='/media/icons/duotune/general/gen051.svg'
        title='User management'
        fontIcon='bi-layers'
      /> */}
      {/* <div className='menu-item'>
        <a
          target='_blank'
          className='menu-link'
          href={process.env.REACT_APP_PREVIEW_DOCS_URL + '/docs/changelog'}
        >
          <span className='menu-icon'>
            <KTSVG path='/media/icons/duotune/general/gen005.svg' className='svg-icon-2' />
          </span>
          <span className='menu-title'>Changelog {process.env.REACT_APP_VERSION}</span>
        </a>
      </div> */}
    </>
  )
}

export {SidebarMenuMain}
