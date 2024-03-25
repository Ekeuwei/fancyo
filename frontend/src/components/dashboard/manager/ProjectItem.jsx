import styled from "styled-components"
// import ProgressBar from "./ProgressBar"
import { useState } from "react"
import PropTypes from 'prop-types'
import dateFormat from "dateformat"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { formatNumber, setAlpha } from "../../../common/utils"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheckCircle, faHand, faMinus, faPlus, faTimesCircle } from "@fortawesome/free-solid-svg-icons"
import { useDispatch } from "react-redux"
import { clearProjectErrors } from "../../../app/project/projectSlice"
import DealEngagement from "../modals/DealEngagement"

const ProjectItem = ({project, idx}) => {
    const dispatch = useDispatch()
    const history = useHistory()
    const [isOpen, setOpen] = useState("closed")
    const [wantsToSubscribe, setWantsToSubscribe] = useState(false)
    
    const handleModalOpen = ()=> setOpen("opened")
    const handleModalClose = ()=> {
        setOpen("closed")
        dispatch(clearProjectErrors())
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
    const title = `Project ${project.uniqueId} - ${project.eRoi}% in ${projectDuration} day${projectDuration>1?'s':''}`
    const toStartIn = calculateCountdown(project.startAt)
    const toEndIn = calculateCountdown(project.endAt)
    const projectStarted = project.status!=='pending';
    const contributedAmount = project.contributors.reduce((total, contributor) => total + contributor.amount, 0)
    
    // const profit = ((project.status==='in progress'? project.availableBalance : (project.roi + contributedAmount)) * contributedQuota) - contributedAmount
    const profit = (project.status==='in progress'? project.availableBalance : (project.roi + contributedAmount)) - contributedAmount
    const percentIncrease = isNaN(profit/contributedAmount)? 0: formatNumber(profit/contributedAmount * 100)

    return (
        <>
            <Wrapper onClick={handleOpenProject}>
                <Timer color={project.status==='successful'?'success':project.status==='failed'?'error':project.status==='no engagement'?'accent':''}>
                    {['no engagement', 'successful', 'failed'].includes(project.status)?
                    <Completed>
                        <StatusIcon 
                            color={project.status==='successful'?'success':project.status==='failed'?'error':'accent'} 
                            icon={project.status==='successful'? faCheckCircle:project.status==='failed'? faTimesCircle : faHand}
                            size="2x"/>
                    </Completed>:
                    <>
                        <Label>{projectStarted?'Ends':'Starts'} in</Label>
                        <Time>{projectStarted? toEndIn.split(" ")[0]:toStartIn.split(" ")[0]}</Time>
                        <TimeValue>{projectStarted? toEndIn.split(" ")[1]:toStartIn.split(" ")[1]}</TimeValue>
                    </>}
                </Timer>
                <ProjectDetails>
                    <Title>{title}</Title>
                    <ProjectLogistics>
                        <Details>
                            <InvestmentType>Project ID: {project.uniqueId}</InvestmentType>
                            {project.status!='pending'&& <DateLabel>{`${toEndIn.split(" ")[0]==0?'Ended':'Started'} ${dateFormat(toEndIn.split(" ")[0]==0?project.endAt:project.startAt, 'dd mmm, yyyy')}`}</DateLabel>}
                            <Status>
                                <StatusLabel>Status</StatusLabel> 
                                <StatusValue color={project.status==='successful'?'success':project.status==='failed'?'error':'accent'}>{project.status}</StatusValue>
                            </Status>
                            {/* <ProgressBar width={10} content={''}/> */}
                        </Details>
                        {!projectStarted?
                        <StatusWrapper value={project.contributors.length}>
                            <Subscribers>{project.contributors.length}</Subscribers>
                            <SubscriberLabel>{project.contributors.length>1?'Contributors':'Contributor'}</SubscriberLabel>
                        </StatusWrapper>:
                        <EarningsWrapper>
                            {project.status === 'no engagement'?<>
                                    {project.contributors.length>0?
                                        <PercentIncrease>Contributions <br/>refunded</PercentIncrease>:
                                        <PercentIncrease>No Contributor</PercentIncrease>}
                            </>:
                                <Balance display={percentIncrease == 0?'none':''} value={percentIncrease} color={profit>0?'success':'error'}><FontAwesomeIcon icon={profit>0?faPlus:faMinus} size="xs" style={{marginRight:'2px'}}/>{percentIncrease}%</Balance>
                            }
                            
                        </EarningsWrapper>}

                    </ProjectLogistics>
                </ProjectDetails>

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
ProjectItem.propTypes = {
    user: PropTypes.object.isRequired,
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
const ProjectDetails = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
`
const ProjectLogistics = styled.div`
    display: flex;
    align-items: center;
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
    font-weight: 500;
    margin-bottom: 3px;
`
const Status = styled.div`
    margin: 0;
    display: flex;
    color: ${({theme})=>theme.colors.white};
    font-size: 10px;
    text-transform: capitalize;
    margin-top: 2px;
`
const StatusLabel = styled.span`
    background: ${({theme})=>setAlpha(theme.colors.black, 0.58)};
    border-radius: 5px 0 0 5px;
    padding: 3px 7px;
    `
const StatusValue = styled.span`
    background: ${({theme, color})=>theme.colors[color]};
    border-radius: 0 5px 5px 0;
    padding: 3px 7px;
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
const DateLabel = styled(InvestmentType)`
    color: ${({theme})=>theme.colors.text};
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
    display: ${({display})=>display};
    margin: 1px 0;
    font-size: 18px;
    font-weight: 500;
    color: ${({theme, color})=>color?theme.colors[color]:''}
`
const PercentIncrease = styled.div`
    color:${({theme})=>theme.colors.dark2};
    text-transform: capitalize;
    font-size: 12px;
    font-weight: 500;
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

export default ProjectItem