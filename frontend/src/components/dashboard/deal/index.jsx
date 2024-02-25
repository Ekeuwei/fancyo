import NavHeader from '../layout/NavHeader'
import ContentDetailsList from '../layout/ContentDetailsList'

import sampleData from '../modals/data.json'
import Stakes from './Stakes'
const Deal = () => {

  return (
    <div>
        <NavHeader title={"7thPriest | 30% in 7 Days"}/>
        <ContentDetailsList data={sampleData}/>
        <Stakes />
    </div>
  )
}



export default Deal