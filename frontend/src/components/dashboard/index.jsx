// import styled from "styled-components"
import { BodyWrapper } from "../../theme/ThemeStyle"
import Deals from "./DealsWrapper"
import Header from "./Header"
import WalletDisplay from "./WalletDisplay"
const Dashboard = () => {
    return (
        <>
            <Header />
            <BodyWrapper>
                <WalletDisplay />
                <Deals />
            </BodyWrapper>
        </>
    )
}


export default Dashboard