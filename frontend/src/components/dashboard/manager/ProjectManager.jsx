import styled from "styled-components"
import { Avatar, AvatarOverlay, Loading } from "../../../theme/ThemeStyle"
import NavHeader from "../layout/NavHeader"
import DealAds from "../DealAds"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { api } from "../../../common/api"
import PropTypes from 'prop-types'
import dateFormat from "dateformat"
import { createToast } from "../../../app/user/userSlice"

const ProjectManager = ({match}) => {
    const dispatch = useDispatch()
    const { punterDetails, loading, error } = useSelector(state => state.project)

    useEffect(()=>{
        dispatch(api.getPunterDetails(match.params.id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    useEffect(()=>{
      if(error){
        dispatch(createToast({message:error, type:'error'}))
      }
    },[error, dispatch])

    const joinedDate = dateFormat(punterDetails?.punter.createdAt, 'dS mmmm, yyyy')
    return (
        <>
            {punterDetails&& <div>
                <NavHeader />
                <AvatarWrapper>
                    <Avatar src="../src/assets/avatar.png" alt="Avatar"/>
                </AvatarWrapper>
                <TitleName>7thPriest</TitleName>
                <List>
                    <ListItem>
                        <Text>Joined</Text>
                        <Text>{joinedDate}</Text>
                    </ListItem>
                    <ListItem>
                        <Text>Success Rate</Text>
                        <Text>{punterDetails.successfulCount/punterDetails.projectCount * 100}%</Text>
                    </ListItem>
                    <ListItem>
                        <Text>Average ROI</Text>
                        <Text>${punterDetails.averageRoi}</Text>
                    </ListItem>
                    <ListItem>
                        <Text>Projects</Text>
                        <Text>{punterDetails.projectCount}</Text>
                    </ListItem>
                    <ListItem>
                        <Text>Success</Text>
                        <Text>{punterDetails.successfulCount}</Text>
                    </ListItem>
                </List>
                {punterDetails&& <RecentProjects>
                    <SubHeading>Recent Projects</SubHeading>
                    {punterDetails.projects.map((project, idx) => (
                        <DealAds project={project} key={idx} />
                    ))}
                </RecentProjects>}
            </div>}
            <Loading value={loading?'loading...':''} />
        </>
    )
}

ProjectManager.propTypes = {
  match: PropTypes.object
}

const RecentProjects = styled.div`
    display: flex;
    flex-direction: column;
`
const SubHeading = styled.div`
    padding: 15px 10px;
    background-color: ${({theme})=>theme.colors.dark2};
    color: ${({theme})=>theme.colors.white};
    border-radius: 5px;
    text-transform: uppercase;
`
const AvatarWrapper = styled(AvatarOverlay)`
    width: 120px;
    height: 120px;
    margin: 10px auto;
`
const TitleName = styled.h3`
    font-size: 18px;
`
const Text = styled.p`
    margin: 0;
`
const List = styled.div`
    &:first-child{
        border-bottom: 1px solid ${({theme})=>theme.colors.dark4};
    }
`
const ListItem = styled.div`
    display: flex;
    padding: 15px 0;
    border-top: 1px solid ${({theme})=>theme.colors.dark4};
    align-items: center;
    justify-content: space-between;
`


export default ProjectManager