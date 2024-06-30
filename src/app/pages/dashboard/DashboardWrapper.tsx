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
import {Container, Row, Col, Card} from 'react-bootstrap'
import {TotalCutomer} from '../../modules/widgets/TotalCustomers'
import {TotalSupplier} from '../../modules/widgets/TotalSupplier'
import {TotalPurchase} from '../../modules/widgets/TotalPurshase'
import {TotalProduct} from '../../modules/widgets/TotalProduct'
const styles: {[key: string]: React.CSSProperties} = {
  body: {
    marginTop: '20px',
    background: '#FAFAFA',
  },
  orderCard: {
    color: '#fff',
  },
  bgCBlue: {
    background: 'linear-gradient(45deg,#4099ff,#73b4ff)',
  },
  bgCGreen: {
    background: 'linear-gradient(45deg,#2ed8b6,#59e0c5)',
  },
  bgCYellow: {
    background: 'linear-gradient(45deg,#FFB64D,#ffcb80)',
  },
  bgCPink: {
    background: 'linear-gradient(45deg,#FF5370,#ff869a)',
  },
  card: {
    borderRadius: '5px',
    boxShadow: '0 1px 2.94px 0.06px rgba(4,26,55,0.16)',
    border: 'none',
    marginBottom: '30px',
    transition: 'all 0.3s ease-in-out',
  },
  cardBlock: {
    padding: '25px',
  },
  icon: {
    fontSize: '26px',
  },
  fLeft: {
    float: 'left',
  },
  fRight: {
    float: 'right',
  },
}
const DashboardPage: FC = () => (
  <>
    {/* <div className='row g-5 g-xl-10 mb-5 mb-xl-10'>
      <div className='col-md-6 col-lg-12 col-xl-12 col-xxl-12 mb-md-5 mb-xl-10'>
        <div className='row g-5 g-xl-8'>
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
      </div>
    </div> */}
    <Container fluid>
      <Row className='mb-4'>
        <Col md={4} className='mb-4'>
          <Card style={{height: 150, padding: 15}}>
            <Card.Body>
              <Card.Title>Ventes aujourd'hui</Card.Title>
              <Card.Text>643,600 TND</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className='mb-4'>
          <Card style={{height: 150, padding: 15}}>
            <Card.Body>
              <Card.Title>Ventes cette semaine</Card.Title>
              <Card.Text>643,600 TND</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className='mb-4'>
          <Card style={{height: 150, padding: 15}}>
            <Card.Body>
              <Card.Title>Ventes ce mois-ci</Card.Title>
              <Card.Text>643,600 TND</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={4} className='mb-4'>
          <Card style={{height: 150, padding: 15}}>
            <Card.Body>
              <Card.Title>Ventes cette année</Card.Title>
              <Card.Text>643,600 TND</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className='mb-4'>
          <Card style={{height: 150, padding: 15}}>
            <Card.Body>
              <Card.Title>Total des factures impayées</Card.Title>
              <Card.Text>643,600 TND</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className='mb-4'>
          <Card style={{height: 150, padding: 15}}>
            <Card.Body>
              <Card.Title>Total des factures payées</Card.Title>
              <Card.Text>0,000 TND</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
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
