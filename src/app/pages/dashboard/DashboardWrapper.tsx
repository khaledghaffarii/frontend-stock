/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC} from 'react'
import {useIntl} from 'react-intl'
import {toAbsoluteUrl} from '../../../_metronic/helpers'
import {PageTitle} from '../../../_metronic/layout/core'
import {
  ListsWidget2,
  ListsWidget3,
  ListsWidget4,
  ListsWidget6,
  TablesWidget5,
  TablesWidget10,
  MixedWidget8,
  CardsWidget7,
  CardsWidget17,
  CardsWidget20,
  ListsWidget26,
  EngageWidget10,
  StatisticsWidget5,
} from '../../../_metronic/partials/widgets'
import {TotalCutomer} from '../../modules/widgets/TotalCustomers'
import {TotalSupplier} from '../../modules/widgets/TotalSupplier'
import {TotalPurchase} from '../../modules/widgets/TotalPurshase'
import {TotalProduct} from '../../modules/widgets/TotalProduct'

const DashboardPage: FC = () => (
  <>
    {/* begin::Row */}
    <div className='row g-5 g-xl-10 mb-5 mb-xl-10'>
      <div className='col-md-6 col-lg-12 col-xl-12 col-xxl-12 mb-md-5 mb-xl-10'>
        {/* <CardsWidget20
          className='h-md-50 mb-5 mb-xl-10'
          description='Active Projects'
          color='#F1416C'
          img={toAbsoluteUrl('/media/patterns/vector-1.png')}
        /> */}
        <div className='row g-5 g-xl-8'>
          <div className='col-xl-3'>
            {/* <TotalCutomer
              className='card-xl-stretch mb-xl-8'
              svgIcon='/media/icons/duotune/user/customer.svg'
              color='white'
              iconColor='primary'
              title='500M$'
              description='SAP UI Progress'
            /> */}
          </div>
          <div className='col-xl-3'>
            <TotalSupplier
              className='card-xl-stretch mb-xl-8'
              //public\media\icons\duotune\user\supplier.svg
              svgIcon='/media/icons/duotune/user/supplier.svg'
              color='white'
              iconColor='primary'
              title='500M$'
              description='SAP UI Progress'
            />
          </div>
          <div className='col-xl-3'>
            <TotalPurchase
              className='card-xl-stretch mb-xl-8'
              svgIcon='/media/icons/duotune/user/purchase.svg'
              color='white'
              iconColor='warning'
              title='500M$'
              description='SAP UI Progress'
            />
          </div>
          <div className='col-xl-3'>
            <TotalProduct
              className='card-xl-stretch mb-xl-8'
              //public\media\icons\duotune\user\supplier.svg
              svgIcon='/media/icons/duotune/user/product.svg'
              color='white'
              iconColor='primary'
              title='500M$'
              description='SAP UI Progress'
            />
          </div>
        </div>
        {/* <div className='row g-5 g-xl-8'>
          <div className='col-xl-3'>
            <TotalCutomer
              className='card-xl-stretch mb-xl-8'
              svgIcon='/media/icons/duotune/communication/com006.svg'
              color='white'
              iconColor='primary'
              title='500M$'
              description='SAP UI Progress'
            />
          </div>
          <div className='col-xl-3'>
            <TotalSupplier
              className='card-xl-stretch mb-xl-8'
              //public\media\icons\duotune\user\supplier.svg
              svgIcon='/media/icons/duotune/finance/fin006.svg'
              color='white'
              iconColor='primary'
              title='500M$'
              description='SAP UI Progress'
            />
          </div>
          <div className='col-xl-3'>
            <TotalCutomer
              className='card-xl-stretch mb-xl-8'
              svgIcon='/media/icons/duotune/communication/com006.svg'
              color='white'
              iconColor='primary'
              title='500M$'
              description='SAP UI Progress'
            />
          </div>
          <div className='col-xl-3'>
            <TotalSupplier
              className='card-xl-stretch mb-xl-8'
              //public\media\icons\duotune\user\supplier.svg
              svgIcon='/media/icons/duotune/graphs/gra005.svg'
              color='white'
              iconColor='primary'
              title='500M$'
              description='SAP UI Progress'
            />
          </div>
        </div> */}

        {/* <CardsWidget7
          className='h-md-50 mb-5 mb-xl-10'
          description='Professionals'
          icon={false}
          stats={357}
          labelColor='dark'
          textColor='gray-300'
        /> */}
      </div>

      {/* <div className='col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10'>
        <CardsWidget17 className='h-md-50 mb-5 mb-xl-10' />
        <ListsWidget26 className='h-lg-50' />
      </div> */}
      {/* end::Col */}

      {/* begin::Col */}
      {/* <div className='col-xxl-6'>
        <EngageWidget10 className='h-md-100' />
      </div> */}
      {/* end::Col */}
    </div>
    {/* end::Row */}

    {/* begin::Row */}
    <div className='row gx-5 gx-xl-10'>
      {/* begin::Col */}
      <div className='col-xxl-6 mb-5 mb-xl-10'>
        {/* <app-new-charts-widget8 cssclassName="h-xl-100" chartHeight="275px" [chartHeightNumber]="275"></app-new-charts-widget8> */}
      </div>
      {/* end::Col */}

      {/* begin::Col */}
      <div className='col-xxl-6 mb-5 mb-xl-10'>
        {/* <app-cards-widget18 cssclassName="h-xl-100" image="./assets/media/stock/600x600/img-65.jpg"></app-cards-widget18> */}
      </div>
      {/* end::Col */}
    </div>
    {/* end::Row */}

    {/* begin::Row */}
    <div className='row gy-5 gx-xl-8'>
      <div className='col-xxl-4'>
        <ListsWidget3 className='card-xxl-stretch mb-xl-3' />
      </div>
      <div className='col-xl-8'>
        <TablesWidget10 className='card-xxl-stretch mb-5 mb-xl-8' />
      </div>
    </div>
    {/* end::Row */}

    {/* begin::Row */}
    <div className='row gy-5 g-xl-8'>
      <div className='col-xl-4'>
        <ListsWidget2 className='card-xl-stretch mb-xl-8' />
      </div>
      <div className='col-xl-4'>
        <ListsWidget6 className='card-xl-stretch mb-xl-8' />
      </div>
      <div className='col-xl-4'>
        <ListsWidget4 className='card-xl-stretch mb-5 mb-xl-8' items={5} />
        {/* partials/widgets/lists/_widget-4', 'class' => 'card-xl-stretch mb-5 mb-xl-8', 'items' => '5' */}
      </div>
    </div>
    {/* end::Row */}

    <div className='row g-5 gx-xxl-8'>
      <div className='col-xxl-4'>
        <MixedWidget8
          className='card-xxl-stretch mb-xl-3'
          chartColor='success'
          chartHeight='150px'
        />
      </div>
      <div className='col-xxl-8'>
        <TablesWidget5 className='card-xxl-stretch mb-5 mb-xxl-8' />
      </div>
    </div>
  </>
)

const DashboardWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
      <DashboardPage />
    </>
  )
}

export {DashboardWrapper}
