import styled from "styled-components"
import MatchFixture from "./MatchFixture"
import PropTypes from 'prop-types'
import { formatAmountFraction, formatNumberFraction } from "../../../common/utils"

const StakeDetails = ({value, ticket}) => {
    const combinedOdds = ticket.games.reduce((acc, game)=> acc * game.odds, 1)
    const expectedRoi = ticket.status==='failed'? 0 : combinedOdds * ticket.stakeAmount

    return (
        <Details value={value} >
            <Title>Details</Title>
            <TextWrapper>
                <TextField>Type: Multiple</TextField>
            </TextWrapper>
            <TextWrapper>
                <TextField>Odds</TextField>
                <Value>{formatNumberFraction(combinedOdds)}</Value>
            </TextWrapper>
            <TextWrapper>
                <TextField>Stake Amount</TextField>
                <Value>{formatAmountFraction(ticket.stakeAmount)}</Value>
            </TextWrapper>
            <TextWrapper value={'underline'}>
                <TextField>{['failed', 'successful'].includes(ticket.status)? 'Return':'Expected Return'}</TextField>
                <Value>{formatAmountFraction(expectedRoi)}</Value>
            </TextWrapper>
            <TextWrapper>
                <TextField>Status</TextField>
                <Value>{ticket.status}</Value>
            </TextWrapper>
            <Fixtures>
                {ticket.games.map((match, idx)=>(<MatchFixture key={idx} fixture={match}/>))}
            </Fixtures>
        </Details>
    )
}

StakeDetails.propTypes = {
    value: PropTypes.string,
    ticket: PropTypes.object
}

const Details = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: ${({theme})=>theme.colors.dark4};
    overflow: auto;
    max-height: ${({ value }) => (value==="collapsing" ? '500px' : '0')};
    transition: max-height 0.5s ease;
    padding: 0 10px;
    padding-bottom: ${({ value }) => (value==="collapsing" ? '10px' : '0')};
`
const Title = styled.h3`
    margin-bottom: 5px;
    font-size: 14px;
`
const TextWrapper = styled.div`
    display: flex;
    border-top: 1px solid ${({theme, value})=>value==='underline'?theme.colors.dark3:'transparent'};
`
const TextField = styled.p`
    margin: 3px;
    font-size: 12px;
    flex: 1;
`
const Value = styled(TextField)`
    flex: 0;
    white-space: nowrap;
`
const Fixtures = styled.div`
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    row-gap: 5px;
`

export default StakeDetails