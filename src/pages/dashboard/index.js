import React, { PureComponent } from 'react'
import NumberCard from './components/NumberCard'
class Dashboard extends PureComponent {
    
    render() {
        const {
            numbers
          } = dashboard
        const numberCards = numbers.map((item, key) => (
            <Col key={key} lg={6} md={12}>
              <NumberCard {...item} />
            </Col>
          ))
        return (
            <div>
                {/* {numberCards} */}
            </div>
        )
    }
}
export default Dashboard
