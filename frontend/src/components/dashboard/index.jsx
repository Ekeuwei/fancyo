// import styled from "styled-components"
import { BodyWrapper } from "../../theme/ThemeStyle"
import Deals from "./DealsWrapper"
import Header from "./Header"
import WalletDisplay from "./WalletDisplay"
import MetaData from "./layout/MetaData"
const Dashboard = () => {
    return (
        <>
            <MetaData title="Dashboard" />
            <Header />
            <BodyWrapper>
                <WalletDisplay />
                <Deals />
            </BodyWrapper>
        </>
    )
}


export default Dashboard