import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'
import StakeDetails from './StakeDetails'
import { useState } from 'react'
import PropTypes from 'prop-types'
import { formatAmount, formatNumberFraction, formatNumberToFloat } from '../../../common/utils'
import { faAngleRight, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'

const Stakes = ({tickets}) => {
    const [openIndex, setOpenIndex] = useState(null)

    const handleToggle = (index) => {
        setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
    };
    return (
        <Wrapper>
            <TitleHead>Tickets</TitleHead>
            <StakesWrapper>
                {tickets.map((ticket, index) =>(
                    <Stake key={index} ticket={ticket} index={index} openIndex={openIndex} handleToggle={handleToggle}/>
                ))}
            </StakesWrapper>
        </Wrapper>
    )
}
Stakes.propTypes = {
    tickets: PropTypes.array, 
}

const Stake = ({ticket, index, openIndex, handleToggle})=>{
    
    const collapseHandler = ()=> handleToggle(index)
    const value = openIndex === index?"collapsing":"";
    const combinedOdds = (ticket.games.reduce((acc, game)=> acc * parseFloat(game.odds), 1))
    const expectedRoi = formatNumberFraction(combinedOdds * ticket.stakeAmount - ticket.stakeAmount)
    const gameType = ticket.games.length > 1? 'Accumulator':'Single'
    const title = `Ticket ${index+1} - ${gameType} @${formatNumberFraction(combinedOdds)} Odds`


    const allMatchesConcluded = ticket.games.every(game => game.matchStatus==='Ended' || game.matchStatus==='AP')
    const wonTicket = allMatchesConcluded && ticket.games.every(game => game.outcome == 1)
    const color = !allMatchesConcluded?'warning':wonTicket?'success':'error'
    const winning = !allMatchesConcluded? '': wonTicket? expectedRoi: -ticket.stakeAmount

    return(
        <StakeWrapper>
            <Header onClick={collapseHandler} value={color}>
                <Icon value={value}>
                    <FontAwesomeIcon icon={faAngleRight} />
                </Icon>
                <Title>{title}</Title>
                <Label value={{winning, color}}>
                    <FontAwesomeIcon icon={winning<0? faMinus:faPlus} size='xs' style={{marginRight:'2px'}}/>
                    {formatAmount(Math.abs(formatNumberToFloat(winning)))}
                </Label>
            </Header>
            <StakeDetails ticket={ticket} value={value} />
        </StakeWrapper>
    )
}

Stake.propTypes = {
    ticket: PropTypes.object, 
    index: PropTypes.number, 
    openIndex: PropTypes.number, 
    handleToggle: PropTypes.func
}

const StakesWrapper = styled.div`
    display: flex;
    flex-direction: column-reverse;
    row-gap: 5px;
    /* margin: 0 5px; */
`

const Wrapper = styled.div`
    border-radius: 10px 10px 0 0;
    overflow: hidden;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    row-gap: 5px;
`

const StakeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 5px;
`
const TitleHead = styled.h2`
    background-color: ${({theme})=>theme.colors.dark2};
    color: ${({theme})=>theme.colors.white};
    padding: 13px 10px;
    text-transform: uppercase;
    margin: 0;
    font-size: 18px;
`
const Header = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    background-color: ${({theme})=>theme.colors.light};
    border-left: solid 3px ${({theme, value})=>theme.colors[value]};
`
const Icon = styled.div`
    padding: 10px;
    transition: transform 0.35s ease;
    transform: ${({value})=> value==="collapsing"? 'rotate(90deg)':'rotate(0)'};
`
const Title = styled.h3`
    font-size: 14px;
    margin: 0;
    flex: 1;
    padding: 15px 0;
    font-weight: 500;
`
const Label = styled.p`
    display: ${({value})=>value?.winning?'':'none'};
    margin: 0;
    /* letter-spacing: 1px; */
    font-size: 14px;
    padding: 5px 10px;
    margin-right: 5px;
    background-color: ${({theme, value})=>theme.colors[value.color]};
    border-radius: 8px;
    letter-spacing: 0.5px;
    color: ${({theme})=>theme.colors.white};
    /* color: ${({theme, value})=>theme.colors[value.color]}; */

`
export default Stakes