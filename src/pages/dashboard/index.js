import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import NumberCard from './components/NumberCard'
import { connect } from 'dva'
import { Row, Col, Card } from 'antd'
import { withI18n } from '@lingui/react'
import { Page } from 'components'
import styles from './index.less'

@withI18n()
@connect(({ app, dashboard, loading }) => ({ app, dashboard, loading }))
class Dashboard extends PureComponent {
  render() {
    const { location, dispatch, dashboard, loading, i18n, app } = this.props
    const { query, pathname } = location
    const { numbers } = dashboard
    const numberCards = numbers.map((item, key) => (
      <Col key={key} lg={6} md={12}>
        <NumberCard {...item} />
      </Col>
    ))
    return (
      <Page inner>
        <div>{numberCards}</div>
      </Page>
    )
  }
}
Dashboard.propTypes = {
  dashboard: PropTypes.object,
}
export default Dashboard
