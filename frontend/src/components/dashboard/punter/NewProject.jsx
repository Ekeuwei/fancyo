import styled from "styled-components"
import { Button, Input, InputLabel, InputWrapper, Loading, NoticeMessage, Select, TextArea } from "../../../theme/ThemeStyle"
import NavHeader from "../layout/NavHeader"
import ModalContainter from "../modals/ModalContainter"
import PropTypes from 'prop-types'
import { useEffect, useState } from "react"
import { formatNumber, setAlpha } from "../../../common/utils"
import CustomDatePicker from "../layout/CustomDatePicker"
import { useDispatch, useSelector } from "react-redux"
import { api } from "../../../common/api"
import { createToast } from "../../../app/user/userSlice"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons"


const NewProject = ({isOpen, handleCloseModal}) => {
    const dispatch = useDispatch()
    const [emptyFields, setEmptyFields] = useState([])
    const [data, setData] = useState({
        eRoi:'',
        maxOdds:'',
        minOdds:'',
        startAt:'',
        endAt:'',
        notes:'',
        progressiveSteps:'',
    })
    const [progressiveStaking, setProgressiveStaking] = useState(false)
    const [showInfo, setShowInfo] = useState(false)
    const [progressiveOptions, setProgressiveOptions] = useState(false)
    const [enforceProgressiveStaking, setEnforceProgressiveStaking] = useState(false)
    const { badge } = useSelector(state => state.user)

    const onChange = (e)=> setData(prevData=>{
        if(['eRoi' ].includes(e.target.name)){
            e.target.value = e.target.value==0?'':formatNumber(e.target.value)
        }
        return {...prevData, [e.target.name]:e.target.value}
    })

    const [startAt, setStartAt] = useState(null);
    const [endAt, setEndAt] = useState(null);
    const { loading, error, message, projects } = useSelector(state => state.project)
    
    const handleSubmit = (e)=>{
        e.preventDefault()

        const newEmptyFields = Object.keys(data).filter(key => key!='notes' && (data[key]===''||data[key]=== undefined))
        setEmptyFields(newEmptyFields)

        if(newEmptyFields.length === 0){
            dispatch(api.createProject(data, projects))
        }
    }

    useEffect(()=>{
        setData(prevData => ({
            ...prevData,
            startAt: startAt?.toISOString(),
            endAt: endAt?.toISOString(),
        }))
    },[endAt, startAt])

    useEffect(()=>{
        if(emptyFields.length>0){
            const timeoutId = setTimeout(()=>setEmptyFields([]),1000)
            return ()=> clearTimeout(timeoutId)
        }
    },[emptyFields])

    useEffect(()=>{
        if(message){
            dispatch(createToast({message, type:'success'}))
            handleCloseModal()
            //clear data
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[dispatch, message])

    useEffect(()=>{
        const withinBadgeClearanceLimit = data.maxOdds > badge?.minOdds
        let start = withinBadgeClearanceLimit? 4:1
        // let start = badge?.minOdds >= parseFloat(data.maxOdds)? 1:4
        const end = 10
    
        const options = []

        for(let i = start; i < end; i++){
            options.push(<option key={i} value={i}> {`${i} Step${i>1?'s':''}`}</option>)
        }
    
        setEnforceProgressiveStaking(withinBadgeClearanceLimit)
        if(withinBadgeClearanceLimit){
            // Minimum steps
            setData(prev => ({...prev, progressiveSteps: 4}))
        }
        setProgressiveStaking(withinBadgeClearanceLimit)
        setProgressiveOptions(options)

    },[badge, data.maxOdds])

    const handleProgressiveStaking = ()=>{
        if(!enforceProgressiveStaking){
            setProgressiveStaking(!progressiveStaking)
        }
    }


    return (
        <ModalContainter isOpen={isOpen} handleModalClose={handleCloseModal}>
            <>
                <NavHeader handleModalClose={handleCloseModal} title={"New Project"}/>
                
                <FormController onSubmit={handleSubmit}>

                    <InputWrapper value={emptyFields.includes('minOdds')?'error':''}>
                        <InputLabel value={data.minOdds}>Minimum Odds Per Ticket</InputLabel>
                        <Input 
                            placeholder="Minimum Odds Per Ticket"
                            name="minOdds"
                            invalid={emptyFields.includes('minOdds')?'error':''}
                            autoComplete="off"
                            onChange={onChange}
                            value={data.minOdds}
                            label={data.minOdds} />
                    </InputWrapper>
                    <InputWrapper value={emptyFields.includes('maxOdds')?'error':''}>
                        <InputLabel value={data.maxOdds}>Maximum Odds Per Ticket</InputLabel>
                        <Input 
                            placeholder="Maximum Odds Per Ticket"
                            name="maxOdds"
                            invalid={emptyFields.includes('maxOdds')?'error':''}
                            autoComplete="off"
                            onChange={onChange}
                            value={data.maxOdds}
                            label={data.maxOdds} />
                    </InputWrapper>

                    <InputWrapper>
                        <InputLabel value={data.notes}>Project description</InputLabel>
                        <TextArea 
                            value={data.notes}
                            label={data.notes}
                            onChange={onChange}
                            name="notes"
                            rows={7}
                            placeholder="Add notes about the project"
                        />
                    </InputWrapper>

                    {/* Apply progressive staking calculator (4 steps) */}
                    <ProgressiveWrapper>
                        {showInfo&&<Info><strong>Progressive staking: </strong>The progressive staking strategy is used to manage bankroll and optimize return.
                            Instead of placing fixed bets, this strategy involves adjusting the stake size base on 
                            the outcome of previous bets. After a loss, the stake increases progressively, aiming to 
                            recover previous losses efficiently. Convrsely, after a win, the stake resets to the initial amount.
                            This approach is designed to mitigate the impact of losses, maximize recovery during winning streaks, and provide
                            a systematic framework for long-term profitability.<br/><br/>
                            Progressive staking will not be enforced when you are handling projects below your badge limits. Hence, for instance, progressive staking will be
                            enforced if this project's  maximum odds are upto {badge?.minOdds}. 
                        </Info>}
                        <CheckBoxWrapper >
                            <Checkbox disabled={enforceProgressiveStaking} type='checkbox' onChange={handleProgressiveStaking} checked={progressiveStaking}/>
                            <CheckBoxLabel checked={progressiveStaking} onClick={handleProgressiveStaking}>Apply progressive staking </CheckBoxLabel>
                            <FontAwesomeIcon icon={faInfoCircle} style={{marginLeft: '10px'}} onClick={()=>setShowInfo(!showInfo)}/> 
                        </CheckBoxWrapper>
                        {progressiveStaking&&<InputWrapper value={emptyFields.includes('progressiveSteps')?'error':''}>
                            <InputLabel value={data.progressiveSteps}>Staking Steps</InputLabel>
                            <Select 
                                id="progressiveSteps" 
                                name="progressiveSteps" 
                                value={data.progressiveSteps} 
                                onChange={onChange} 
                                label={data.progressiveSteps} >
        
                                <option value="">Steps</option>
                                { progressiveOptions }

                            </Select>
                        </InputWrapper>}
                    </ProgressiveWrapper>

                    <CustomDatePicker 
                        dateTime={startAt} 
                        invalid={emptyFields.includes('startAt')?'error':''}
                        setDateTime={setStartAt} 
                        placeholder="Project start time"
                        customDateFormat={"MMMM d, yyyy h:mm aa"}
                    />
                    <CustomDatePicker 
                        dateTime={endAt} 
                        invalid={emptyFields.includes('endAt')?'error':''}
                        setDateTime={setEndAt} 
                        placeholder="Project end time"
                        customDateFormat={"MMMM d, yyyy h:mm aa"}
                    />
                    <InputWrapper value={emptyFields.includes('eRoi')?'error':''} >
                        <InputLabel value={data.eRoi}>Estimated ROI (%)</InputLabel>
                            <Input 
                                placeholder="Estimated ROI (%)"
                                name="eRoi" 
                                autoComplete="off"
                                invalid={emptyFields.includes('eRoi')?'error':''}
                                onChange={onChange}
                                value={data.eRoi}
                                label={data.eRoi} />
                    </InputWrapper>
                    <NoticeMessage value={error?'error':''}>{error}</NoticeMessage>
                    <Button type="submit">Submit <Loading value={loading}/></Button>
                </FormController>
            </>
        </ModalContainter>
    )
}

NewProject.propTypes = {
    isOpen: PropTypes.string,
    handleCloseModal: PropTypes.func,
}

const FormController = styled.form`
    display: flex;
    flex-direction: column;
    padding: 10px;
`
const Info = styled.p`
    line-height: 1.35;
    font-size: 14px;
`
const CheckBoxWrapper = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
`
const Checkbox = styled.input`
    width: 18px;
    height: 18px;
    margin-right: 5px;
`
const CheckBoxLabel = styled.p`
    margin: 0;
    color: ${({checked, theme})=>checked?theme.colors.text:theme.colors.dark1};
    font-weight: ${({checked})=>checked?700:500};
    font-size: 16px;
`
const ProgressiveWrapper = styled.div`
    padding: 20px;
    background: ${({theme})=>setAlpha(theme.colors.success, 0.35)};
    border-radius: 10px;
`

export default NewProject