import styled from "styled-components"
import PropTypes from 'prop-types'
import MatchFixture from "../deal/MatchFixture"

const Ticket = ({value, stakeAmount, picks}) => {
    const totalOdds = picks.reduce((acc, pick)=> acc*pick.odds, 1).toFixed(2)
    const roi = (stakeAmount * totalOdds).toFixed(2)
    return (
        <Details value={value} >
            <Title>Details</Title>
            <TextWrapper>
                <TextField>Type: {picks.length>1? 'Multiple':'Single'}</TextField>
            </TextWrapper>
            <TextWrapper>
                <TextField>Odds</TextField>
                <Value>{totalOdds}</Value>
            </TextWrapper>
            <TextWrapper>
                <TextField>Stake Amount</TextField>
                <Value>{stakeAmount}</Value>
            </TextWrapper>
            <TextWrapper value={'underline'}>
                <TextField>Estimated Return</TextField>
                <Value>{roi}</Value>
            </TextWrapper>
            <Fixtures>
                {picks.map((pick, idx)=>(<MatchFixture key={idx} fixture={pick}/>))}
            </Fixtures>
        </Details>
    )
}

Ticket.propTypes = {
    value: PropTypes.string,
    stakeAmount: PropTypes.string,
    picks: PropTypes.array,
}

const Details = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: ${({theme})=>theme.colors.dark4};
    overflow: auto;
    transition: max-height 0.5s ease;
    padding: 0 10px;
    margin-bottom: 5px;
    border-radius: 5px;
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

export default Ticket