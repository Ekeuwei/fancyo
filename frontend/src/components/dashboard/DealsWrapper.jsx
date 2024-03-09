import { useEffect, useState } from "react"
import styled from "styled-components"
import DealAds from "./DealAds"
import SearchDeals from "./SearchDeals"
import { useDispatch, useSelector } from "react-redux"
import { api } from "../../common/api"
import { Loading } from "../../theme/ThemeStyle"
import { createToast } from "../../app/user/userSlice"
import FloatingButton from "./layout/FloatingButton"
import NewProject from "./punter/NewProject"

const DealsWrapper = () => {
    const dispatch = useDispatch()

    const [dealActive, setDealsActive] = useState('active')
    const [myDealActive, setMyDealsActive] = useState('')
    const [tabDirection, setTabDirection] = useState('general')

    const { projects, myProjects, loading, error } = useSelector(state => state.project)

    const user = JSON.parse(localStorage.getItem('user'))
    
    useEffect(()=>{
        dispatch(api.getProjects())
        dispatch(api.getMyProjects())
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    useEffect(()=>{
      if(error){
        dispatch(createToast({message:error, type:'error'}))
      }
    },[error, dispatch])

    const [isOpen, setOpen] = useState("closed")
    const handleModalClose = ()=> setOpen("closed")
    const handleModalOpen = ()=> setOpen("opened")

    const dealHandler = ()=>{
        setDealsActive('active')
        setMyDealsActive('')
        setTabDirection('general')
    }
    const myDealHandler = ()=>{
        setMyDealsActive('active')
        setDealsActive('')
        setTabDirection('personal')
    }

    return (
        <Wrapper>

            <Header>
                <Nav value={dealActive} onClick={dealHandler}>Projects</Nav>
                <Nav value={myDealActive} onClick={myDealHandler}>My Projects</Nav>
            </Header>

            <List>
                <SearchDeals />
                {loading?<Loading value={loading?'loading':''} />:<>
                    {tabDirection==='general'?
                        projects?.projects.map((project, index) => <DealAds key={index} idx={index} project={project} user={user} />):
                        myProjects?.projects.map((project, index) => <DealAds key={index} idx={index} project={project} user={user} />)
                    }
                </>}
            </List>

            {user.role==='punter'&&<>
                <FloatingButton title={'New Project'} isOpen={isOpen} handleButtonClick={handleModalOpen} />
                <NewProject isOpen={isOpen} handleCloseModal={handleModalClose} />
            </>}

        </Wrapper>
    )
}
const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    /* background-color: ${({theme})=>theme.colors.primary}; */
    border-radius: 10px;
    height: 100%;
    overflow: hidden;
`
const Header = styled.div`
    display: flex;
    align-items: center;
    background-color: ${({theme})=>theme.colors.primary};
    justify-content: center;

`
const Nav = styled.div`
    position: relative;
    color: ${({value, theme})=>value==='active'?theme.colors.secondary:theme.colors.text};
    padding: 15px;
    text-align: center;
    flex: 1;
    &::before{
        position: absolute;
        left:50%;
        top:85%;
        z-index: 1;
        transform: translate(-50%, -50%);
        width: 50%;
        border-radius: 10px;
        content:'';
        border-bottom: ${({value, theme})=>`3px solid ${value==='active'?theme.colors.secondary:theme.colors.transparent}`};
    }
`
const List = styled.div`
    background-color: ${({theme})=>theme.colors.light};
    display: flex;
    /* min-height: 150px; */
    flex-direction: column;
    padding: 5px;
    row-gap: 5px;
`

export default DealsWrapper