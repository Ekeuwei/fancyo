import styled from "styled-components"
import { BodyWrapper, Button, Loading } from "../../../theme/ThemeStyle"
import Stakes from "../deal/Stakes"
import ContentDetailsList from "../layout/ContentDetailsList"
import NavHeader from "../layout/NavHeader"
import { createContext, useEffect, useState } from "react"
import NewTicket from "./NewTicket"
import { useDispatch, useSelector } from "react-redux"
import { api } from "../../../common/api"
import PropTypes from 'prop-types'
import { createToast } from "../../../app/user/userSlice"
import MetaData from "../layout/MetaData"

export const ProjectDetailsContext = createContext()

const ProjectDetails = ({match}) => {
    const dispatch =  useDispatch()
    const [isOpen, setOpen] = useState("closed")
    const handleModalOpen = ()=> setOpen("opened")
    const handleModalClose = ()=> setOpen("closed")

    const { projectDetails, loading, error } = useSelector(state => state.project)
    const user = JSON.parse(localStorage.user)

    useEffect(()=>{
      // Get project, get tickets
      dispatch(api.getProjectDetails(match.params.id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    useEffect(()=>{
      if(error){
        dispatch(createToast({message:error, type:'error'}))
      }
    },[error, dispatch])

    const projectDuration = Math.ceil(Math.abs(new Date(projectDetails?.project.endAt).getTime() - new Date(projectDetails?.project.startAt).getTime())/(1000 * 60 * 60 * 24))
    const title = projectDetails?`Project ${projectDetails.project.uniqueId} | ${projectDetails.project.eRoi}% in ${projectDuration} days`:'Project'
    const isProjectPunter = projectDetails?.project.punter._id === user._id
    const canCreateTicket = isProjectPunter && projectDetails?.project.status==='in progress'
    
    const totalContributedAmount = projectDetails?.project.contributors.reduce((total, contributor) => total + contributor.amount, 0)
    const contributor = projectDetails?.project.contributors.find(contributor => contributor.user === user._id)
    const contributedQuota = isNaN(contributor?.amount)? 1 : (contributor.amount/totalContributedAmount)
    const isGuest = !(contributor || isProjectPunter)
    
    return (
      <ProjectDetailsContext.Provider value={{contributedQuota, isGuest}}>
        <Wrapper>
            <MetaData title={title} />
            <NavHeader title={title}/>
            <BodyWrapper>
              {loading &&isOpen==="closed"?<Loading value={loading?'loading':''} />:<>
                {projectDetails&& <ContentDetailsList project={projectDetails.project} title={title}/>}
                {canCreateTicket&& <Btn onClick={handleModalOpen}>+ Add Ticket</Btn>}
                
                {projectDetails?.tickets.length > 0 && 
                  <Stakes 
                    tickets={projectDetails.tickets} 
                    contributedQuota={contributedQuota}/>}

                <NewTicket isOpen={isOpen} handleModalClose={handleModalClose} projectId={projectDetails?.project._id} />
              </>}
            </BodyWrapper>

        </Wrapper>
      </ProjectDetailsContext.Provider>
    )
}

ProjectDetails.propTypes = {
  match: PropTypes.object
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
`
const Btn = styled(Button)`
    max-width: 200px;
    align-self: center;
`

export default ProjectDetails