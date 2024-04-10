/* eslint-disable react/no-unescaped-entities */
import styled from 'styled-components'
import { appName } from '../../../App'

const Disclaimer = () => {
  return (
    <Wrapper>
        <Title>Disclaimer</Title>
        <p>By contributing funds to this project, you acknowledge and agree to the following:</p>
        <List>
            <Item> <strong>Investment Risks:</strong> Sports betting involves inherent risks, and there is a possibility of losing some or all of your contribution. Returns on investment (ROI) are not guaranteed, and the value of your investment may fluctuate. </Item>
           
            <Item> <strong>Risk-Free Contribution Option:</strong> {appName} offers a Risk-Free Contribution option for users who prefer to minimize their risk exposure. When opting in to this feature, users receive a full refund of their contribution if a project fails to deliver the expected returns. However, in exchange for this added security, users will receive a reduced share of the profits for successful projects, capped at 20%. </Item>
           
            <Item><strong>Past Performance:</strong> Past performance of punters and projects on {appName} is not indicative of future results. Punters' track records are provided for informational purposes and do not guarantee similar outcomes in future projects.</Item>
           
            <Item><strong>Project Duration:</strong> Each project has a specified duration, and contributors should be aware that funds will be committed for the entire project period.</Item>

            <Item><strong>Estimated ROI:</strong> The estimated ROI provided in the project details is a projection and may vary based on the actual outcomes of sports betting events.</Item>

            <Item><strong>Commitment Amount:</strong> Contributors should only commit funds that they can afford to lose. Investment decisions are at the contributor's discretion, and they are responsible for assessing their risk tolerance.</Item>
            
            <Item><strong>Platform Commission:</strong> {appName} charges a platform commission of 10% on the profits generated from each successful project. This commission contributes to the maintenance and improvement of the platform.</Item>
            
            <Item><strong>Punter Commission:</strong> Punters receive a commission of 20% on the profits generated from each successful project they manage.</Item>

            <Item><strong>Profit Distribution:</strong> After deducting the platform and punter commissions, the remaining balance (70%) of the profit, along with your initial capital, will be credited to your {appName} wallet in the event of a successful project. However, if you opted for the <strong>Risk-Free Contribution Option,</strong> you'll receive only 20% of the profit in the event of a successful project</Item>

            <Item><strong>No Refunds:</strong> Once funds are committed to a project, they cannot be refunded. Contributors should carefully review project details before making a commitment.</Item>

            <Item><strong>Punter Instructions:</strong> Punters provide instructions for the sports betting events. Contributors should understand that outcomes are influenced by various factors, and results are not guaranteed.</Item>
            
            <Item><strong>Reservation of Rights:</strong> {appName} reserves the right to refuse service to anyone at any time without notice, and we are not responsible for any losses incurred as a result of participating in sports betting projects on our platform.</Item>

            {/* <Item><strong>Withdrawal Restrictions:</strong> Withdrawals from the {appName} wallet are subject to platform policies, and contributors should be aware of any applicable withdrawal restrictions.</Item> */}

        </List>
        <p>By committing funds to this project, you confirm that you have read, understood, and agree to these terms. It is advised to seek independent financial advice if needed.</p>
    </Wrapper>
  )
}

const Title = styled.div`
    align-self: center;
    font-size: 20px;
    text-transform: uppercase;
    font-weight: 700;
    text-decoration: underline;
`
const List = styled.ol`
    padding-inline-start: 20px;
    margin-block-start: 0;
    margin-block-end: 0;
    line-height: 1.3;
`
const Item = styled.li`
    margin-top: 10px;
`
const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 10px;
    /* text-align: justify; */
`
export default Disclaimer