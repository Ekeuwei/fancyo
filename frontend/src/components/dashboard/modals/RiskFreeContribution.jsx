/* eslint-disable react/no-unescaped-entities */
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import styled from 'styled-components'
import { setAlpha } from '../../../common/utils'
import PropTypes from 'prop-types'

const RiskFreeContribution = ({setRiskFreeContribution, riskFreeContribution}) => {
    const [showToolTips, setShowToolTips] = useState(false)
    return (
        <RiskFreeWrapper>
            {riskFreeContribution?<Info>By opting in to the Risk-Free Contribution feature, you acknowledge that your share of the profits for successful projects will be capped at 20%. For more information, please refer to our Terms of Service.</Info>:
                <Info><strong>Protect Your Investment: Opt-in to Risk-Free Contribution👇</strong></Info>}
            <CheckBoxWrapper>
                <Checkbox type='checkbox' onChange={()=>setRiskFreeContribution(!riskFreeContribution)} checked={riskFreeContribution}/>
                <CheckBoxLabel checked={riskFreeContribution}>Risk-Free Contribution</CheckBoxLabel>
                <FontAwesomeIcon icon={faInfoCircle} style={{marginLeft: 'auto', padding: '10px'}} onClick={()=>setShowToolTips(!showToolTips)}/> 
            </CheckBoxWrapper>
            {showToolTips&&<Tooltips>By checking this box, you're choosing to protect your investment with our Risk-Free Contribution feature. If the project fails to deliver returns, you'll receive a full refund of your contribution. However, your share of the profits for successful projects will be capped at 20%.
            </Tooltips>}
        </RiskFreeWrapper>
    )
}
RiskFreeContribution.propTypes = {
    setRiskFreeContribution: PropTypes.func.isRequired,
    riskFreeContribution: PropTypes.bool.isRequired,
}

const CheckBoxWrapper = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 5px;
    background-color: ${({theme})=> theme.colors.primary};
    `
const RiskFreeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    border-radius: 10px;
    overflow: hidden;
`

const CheckBoxLabel = styled.p`
    margin: 0;
    color: ${({checked, theme})=>checked?theme.colors.text:theme.colors.dark1};
    font-weight: ${({checked})=>checked?700:500};
    font-size: 16px;
`

const Checkbox = styled.input`
    width: 18px;
    height: 18px;
    margin-right: 5px;
`
const Info = styled.p`
    line-height: 1.35;
    font-size: 14px;
    margin: 0;
    padding: 10px;
    background-color: ${setAlpha('#70ea86', 0.5)};
    `
const Tooltips = styled(Info)`
    background-color: ${({theme})=> theme.colors.dark4};
    
`

export default RiskFreeContribution