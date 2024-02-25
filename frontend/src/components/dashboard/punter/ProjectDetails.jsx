import styled from "styled-components"
import { BodyWrapper, Button, Loading } from "../../../theme/ThemeStyle"
import Stakes from "../deal/Stakes"
import ContentDetailsList from "../layout/ContentDetailsList"
import NavHeader from "../layout/NavHeader"
import { useEffect, useState } from "react"
import NewTicket from "./NewTicket"
import { useDispatch, useSelector } from "react-redux"
import { api } from "../../../common/api"
import PropTypes from 'prop-types'
import { createToast } from "../../../app/user/userSlice"

const ProjectDetails = ({match}) => {
    const dispatch =  useDispatch()
    const [isOpen, setOpen] = useState("closed")
    const handleModalOpen = ()=> setOpen("opened")
    const handleModalClose = ()=> setOpen("closed")

    const { projectDetails, loading, error } = useSelector(state => state.project)

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
    const title = projectDetails?`Project ${projectDetails.project.id} | ${projectDetails.project.eRoi}% in ${projectDuration} days`:'Project'

    const user = JSON.parse(localStorage.user)
    return (
      <Wrapper>
          <NavHeader title={title}/>
          <BodyWrapper>
            {loading?<Loading value={loading?'loading':''} />:<>
              {projectDetails&& <ContentDetailsList project={projectDetails.project} title={title}/>}
              {user.role==='punter'&& <Btn onClick={handleModalOpen}>+ Add Ticket</Btn>}
              {projectDetails?.tickets.length > 0 && <Stakes tickets={projectDetails.tickets} />}
              <NewTicket isOpen={isOpen} handleModalClose={handleModalClose} projectId={projectDetails?.project._id} />
            </>}
          </BodyWrapper>

      </Wrapper>
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