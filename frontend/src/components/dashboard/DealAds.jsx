import styled from "styled-components"
// import ProgressBar from "./ProgressBar"
import DealEngagement from "./modals/DealEngagement"
import { useState } from "react"
import PropTypes from 'prop-types'
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { formatAmount, formatNumber, setAlpha } from "../../common/utils"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheckCircle, faMinus, faPlus, faTimesCircle } from "@fortawesome/free-solid-svg-icons"

const DealAds = ({project, idx}) => {
    const history = useHistory()
    const [isOpen, setOpen] = useState("closed")
    const [wantsToSubscribe, setWantsToSubscribe] = useState(false)
    
    const handleModalOpen = ()=> setOpen("opened")
    const handleModalClose = ()=> {
        setOpen("closed")
        setWantsToSubscribe(false)
    }
    const handleSubscribe = ()=>setWantsToSubscribe(true)
    const handleOpenProject = ()=>{
        if(projectStarted){
            history.push(`/project/details/${project._id}`)
        }else{
            handleModalOpen()
        }
    }

    const projectDuration = Math.ceil(Math.abs(new Date(project.endAt).getTime() - new Date(project.startAt).getTime())/(1000 * 60 * 60 * 24))
    const title = `${project.eRoi}% in ${projectDuration} day${projectDuration>1?'s':''}`
    const toStartIn = calculateCountdown(project.startAt)
    const toEndIn = calculateCountdown(project.endAt)
    const projectStarted = project.status!=='pending';
    const contributedAmount = project.contributors.reduce((total, contributor) => total + contributor.amount, 0)

    const profit = project.availableBalance - contributedAmount
    const balance = formatAmount(project.availableBalance)
    const percentIncrease = formatNumber(profit/contributedAmount * 100)
  
    return (
        <>
            <Wrapper onClick={handleOpenProject}>
                <Timer color={project.status==='successful'?'success':project.status==='failed'?'error':''}>
                    {toEndIn.split(" ")[0]==0?
                    <Completed>
                        {['successful', 'failed'].includes(project.status)?
                        <StatusIcon 
                            color={project.status==='successful'?'success':'error'} 
                            icon={project.status==='successful'? faCheckCircle:faTimesCircle}
                            size="2x"/>:
                        <Ended>Ended</Ended>}
                    </Completed>:
                    <>
                        <Label>{projectStarted?'Ends':'Starts'} in</Label>
                        <Time>{projectStarted? toEndIn.split(" ")[0]:toStartIn.split(" ")[0]}</Time>
                        <TimeValue>{projectStarted? toEndIn.split(" ")[1]:toStartIn.split(" ")[1]}</TimeValue>
                    </>}
                </Timer>
                <Details>
                    <Title>{title}</Title>
                    <InvestmentType>Sports Betting</InvestmentType>
                    <Author>Author: {project.punter.username}</Author>
                    <Status>{project.status}</Status>
                    {/* <ProgressBar width={10} content={''}/> */}
                </Details>
                {!projectStarted?
                <StatusWrapper value={project.contributors.length}>
                    <AmountContributed>{formatAmount(contributedAmount)}</AmountContributed>
                    <Subscribers>{project.contributors.length}</Subscribers>
                    <SubscriberLabel>Contributors</SubscriberLabel>
                </StatusWrapper>:
                <EarningsWrapper>
                    {profit!==0&&<>
                        <Profit value={profit}><FontAwesomeIcon icon={profit>0?faPlus:faMinus} size="xs" style={{marginRight:'2px'}}/>{formatNumber(profit)}</Profit>
                        <Balance>{balance}</Balance>
                        <PercentIncrease>{percentIncrease}% {profit>0?'up':'down'}</PercentIncrease>
                    </>}
                </EarningsWrapper>}

            </Wrapper>
            {/* Modal */}
            <DealEngagement 
                isOpen={isOpen} 
                handleModalClose={handleModalClose}
                wantsToSubscribe={wantsToSubscribe}
                handleSubscribe={handleSubscribe}
                project = {project}
                title = {title}
                idx={idx}
                toStartIn = {toStartIn} />
        </>
    )
}
DealAds.propTypes = {
    project: PropTypes.object.isRequired,
    idx: PropTypes.number.isRequired,
}

const Wrapper = styled.div`
    display: flex;
    background-color: ${({theme})=> theme.colors.bg};
    align-items: center;
    column-gap: 5px;
    padding: 5px;
    border-radius: 10px;
`
const Timer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    aspect-ratio: 1/1;
    justify-content: center;
    min-width: 75px;
    border-radius: 50%;
    color: ${({theme})=> theme.colors.primaryColor};
    background-color: ${({theme, color})=> color?setAlpha(theme.colors[color], 0.1): theme.colors.light};
    padding: 15px;
`
const Label = styled.p`
    margin: 0;
    text-transform: uppercase;
    color: ${({theme})=> theme.colors.dark2};
    font-size: 8px;
    font-weight: 600;
`
const TimeValue = styled(Label)`
    color: ${({theme})=> theme.colors.primaryColor};
`
const StatusIcon = styled(FontAwesomeIcon)`
    color: ${({theme, color})=> theme.colors[color]};
`
const Time = styled.h2`
    margin: 0;
    font-size: 22px;
`
const Details = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: 1px;
    flex: 1;
`
const Title = styled(Time)`
    font-size: 18px;
`
const Status = styled.p`
    margin: 0;
    font-size: 10px;
    font-weight: 600;
    text-transform: capitalize;
    font-style: italic;
`
const Completed = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: 5px;
    justify-items: center;
`

const InvestmentType = styled(Label)`
    text-transform: capitalize;
    font-size: 12px;
    font-weight: 500;
`
const Author = styled(InvestmentType)`
    color: ${({theme})=>theme.colors.text};
`

const Ended = styled(TimeValue)`
    font-size: 75%;
`

// Status Starts 
const StatusWrapper = styled.div`
    display: ${({value})=>value===0?'none':'flex'};
    flex-direction: column;
    align-items: center;
    /* background-color: ${({theme})=>theme.colors.light}; */
    padding: 5px;
    border: solid ${({theme})=>theme.colors.primaryColor};
    border-radius: 10px;
    min-width: 75px;
    overflow: hidden;
`
const AmountContributed = styled(Label)`
    background-color: ${({theme})=>theme.colors.primaryColor};
    color: ${({theme})=>theme.colors.white};
    text-align: center;
    font-size: 12px;
    font-weight: 500;
    width: calc(100% + 10px);
    margin-top: -5px;
    padding: 5px;
`
const Subscribers = styled(Time)`
    margin: 5px;
    font-size: 16px;
`
const SubscriberLabel = styled(Label)`
    text-transform: capitalize;
`
// Status Ends

// Earning 
const EarningsWrapper = styled(StatusWrapper)`
    border: none;
    align-items: end;

`
const Balance = styled.h3`
    margin: 1px 0;
    font-size: 18px;
    font-weight: 500;
`
const Profit = styled(Label)`
    font-size: 12px;
    font-weight: 500;
    color: ${({value, theme})=>value>0?theme.colors.won:theme.colors.lost}
`
const PercentIncrease = styled(Profit)`
    color:${({theme})=>theme.colors.dark2};
    text-transform: capitalize;
`

const calculateCountdown = (timestamp)=>{
    const difference = new Date(timestamp).getTime() - new Date().getTime();

    if (difference <= 0) {
        return '0 minutes'; // The timestamp has passed
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    if (days > 0) {
        return `${days} day${days !== 1 ? 's' : ''}`;
    } else if (hours > 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''}`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else {
        return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }
}

export default DealAds