import styled from "styled-components"
import { Button, Input, InputLabel, InputWrapper, Loading, NoticeMessage, TextArea } from "../../../theme/ThemeStyle"
import NavHeader from "../layout/NavHeader"
import ModalContainter from "../modals/ModalContainter"
import PropTypes from 'prop-types'
import { useEffect, useState } from "react"
import { formatNumber, formatNumberToFloat } from "../../../common/utils"
import CustomDatePicker from "../layout/CustomDatePicker"
import { useDispatch, useSelector } from "react-redux"
import { api } from "../../../common/api"
import { createToast } from "../../../app/user/userSlice"


const NewProject = ({isOpen, handleCloseModal}) => {
    const dispatch = useDispatch()
    const [emptyFields, setEmptyFields] = useState([])
    const [data, setData] = useState({
        eRoi:'',
        budget:'',
        startAt:'',
        endAt:'',
        notes:'',
    })

    const onChange = (e)=> setData(prevData=>{
        if(['eRoi', 'budget', ].includes(e.target.name)){
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
            dispatch(api.createProject({...data, budget: formatNumberToFloat(data.budget)}), projects)
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

    return (
        <ModalContainter isOpen={isOpen} handleModalClose={handleCloseModal}>
            <>
                <NavHeader handleModalClose={handleCloseModal} title={"New Project"}/>
                
                <FormController onSubmit={handleSubmit}>
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

                    <InputWrapper value={emptyFields.includes('budget')?'error':''}>
                        <InputLabel value={data.budget}>Project Budget</InputLabel>
                        <Input 
                            placeholder="Project Budget"
                            name="budget"
                            invalid={emptyFields.includes('budget')?'error':''}
                            autoComplete="off"
                            onChange={onChange}
                            value={data.budget}
                            label={data.budget} />
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

                    <CustomDatePicker 
                        dateTime={startAt} 
                        invalid={emptyFields.includes('startAt')?'error':''}
                        setDateTime={setStartAt} 
                        placeholder="Project start time"
                    />
                    <CustomDatePicker 
                        dateTime={endAt} 
                        invalid={emptyFields.includes('endAt')?'error':''}
                        setDateTime={setEndAt} 
                        placeholder="Project end time"
                    />
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


export default NewProject