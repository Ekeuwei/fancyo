import { useState } from "react"
import styled from "styled-components"
import DealAds from "../DealAds"
import { Button } from "../../../theme/ThemeStyle"
import NewProject from "./NewProject"

const ProjectWrapper = () => {
    const [dealActive, setDealsActive] = useState('active')
    const [myDealActive, setMyDealsActive] = useState('')
    const [isOpen, setOpen] = useState('closed')
    const handleNewProject = ()=> setOpen('opened')
    const handleCloseModal = ()=> setOpen('closed')


    const dealHandler = ()=>{
        setDealsActive('active')
        setMyDealsActive('')
    }
    const myDealHandler = ()=>{
        setMyDealsActive('active')
        setDealsActive('')
    }

    return (
        <Wrapper>

            <Header>
                <Nav value={dealActive} onClick={dealHandler}>Active Projects</Nav>
                <Nav value={myDealActive} onClick={myDealHandler}>Completed Projects</Nav>
            </Header>
            <List>
                <Btn onClick={handleNewProject}>+ Create new project</Btn>
                {[1,2,3,5,6,7,8,9,10].map((deal, index) => (<DealAds key={index}/>))}
            </List>
            <NewProject isOpen={isOpen} handleCloseModal={handleCloseModal} />
        </Wrapper>
        )
}
const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    /* background-color: ${({theme})=>theme.colors.primary}; */
    border-radius: 10px;
    overflow: hidden;
`
const Btn = styled(Button)`
    border-radius: 20px;
    margin: 10px 0;
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
    flex-direction: column;
    padding: 5px;
    row-gap: 5px;
`
export default ProjectWrapper