import styled from "styled-components"
import { Avatar, AvatarOverlay, BodyWrapper, Loading } from "../../../theme/ThemeStyle"
import NavHeader from "../layout/NavHeader"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { api } from "../../../common/api"
import PropTypes from 'prop-types'
import dateFormat from "dateformat"
import { createToast } from "../../../app/user/userSlice"
import ProjectItem from "./ProjectItem"
import { formatNumber, setAlpha } from "../../../common/utils"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCertificate } from "@fortawesome/free-solid-svg-icons"

const ProjectManager = ({match}) => {
    const dispatch = useDispatch()
    const { punterDetails, loading, error } = useSelector(state => state.project)

    useEffect(()=>{
        if(!punterDetails){
            dispatch(api.getPunterDetails(match.params.id))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    useEffect(()=>{
      if(error){
        dispatch(createToast({message:error, type:'error'}))
      }
    },[error, dispatch])

    const joinedDate = dateFormat(punterDetails?.punter.createdAt, 'dS mmmm, yyyy')
    const user = JSON.parse(localStorage.getItem('user'))
    return (
        <>
            {punterDetails&& <div>
                <NavHeader />
                <BodyWrapper>

                    <AvatarWrapper>
                        <Avatar src={`/assets/avatars/${punterDetails.punter.avatar}`} alt="Avatar"/>
                    </AvatarWrapper>
                    <Tag>@{punterDetails.punter.username}</Tag>
                    <Badge>
                        <Label>
                            <FontAwesomeIcon icon={faCertificate} style={{marginRight:'3px'}}/>
                            Badge
                        </Label>
                        <Title>{punterDetails.badge.title}</Title>
                    </Badge>
                    <Bio>{punterDetails.punter.bio}</Bio>
                    <List>
                        <ListItem>
                            <Text>Joined</Text>
                            <Text>{joinedDate}</Text>
                        </ListItem>
                        <ListItem>
                            <Text>Success Rate</Text>
                            <Text>{formatNumber(punterDetails.successfulCount/punterDetails.projectCount * 100)}%</Text>
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
                            <ProjectItem user={user} project={project} key={idx} idx={idx} />
                        ))}
                    </RecentProjects>}
                </BodyWrapper>

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

const Badge = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 0 10px;
    `
const Label = styled.p`
    display: flex;
    align-items: center;
    font-weight: 700;
    padding: 5px 10px;
    background: ${({theme})=> theme.colors.accent};
    color: ${({theme})=> setAlpha(theme.colors.white, 0.95)};
    border-radius: 5px 0 0 5px;
    text-transform: uppercase;
    font-size: 12px;
    min-height: 30px;
    margin: 0;
`
const Title = styled.p`
    background: ${({theme})=> theme.colors.success};
    color: ${({theme})=> theme.colors.white};
    border-radius: 0 5px 5px 0;
    min-height: 30px;
    padding: 5px 10px;
    margin: 0;
`
const Tag = styled.p`
    margin: 0;
    text-align: center;
    color: ${({theme})=>theme.colors.dark3};
`
const Text = styled.p`
    margin: 0;
`
const Bio = styled.p`
    margin: 0;
    line-height: 1.35;
    text-align: center;
    margin-bottom: 10px;
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