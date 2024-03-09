import styled from 'styled-components'
import PropTypes from 'prop-types'
import dateFormat from 'dateformat'
import { formatAmount, formatNumber } from '../../../common/utils'

const ContentDetailsList = ({project, title}) => {
    const user = JSON.parse(localStorage.getItem('user'))
    const totalContributedAmount = project.contributors.reduce((acc, contributor)=>acc+contributor.amount, 0)
    const contributor = project.contributors.find(contributor => contributor.user === user._id)
    const userIsPunter = user._id === project.punter._id
    const contributedAmount = contributor?.amount || totalContributedAmount

    const contributedQuota = isNaN(contributedAmount / totalContributedAmount)? 0 : (contributedAmount / totalContributedAmount)
    
    const profit = ((project.availableBalance||project.roi) - totalContributedAmount) * contributedQuota
    const balance = isNaN((project.availableBalance||project.roi) * contributedQuota)? formatAmount(0) : formatAmount((project.availableBalance||project.roi) * contributedQuota)
    const percentIncrease = isNaN(contributedAmount / totalContributedAmount)? 0: formatNumber(profit/contributedAmount * 100)

    return (
        <Content>
            {project.notes&&<Item>
                <Label>{'Description'}</Label>
                <Details>{project.notes}</Details>
            </Item>}
            <Item>
                <Label>{'Punter'}</Label>
                <Details>{project.punter?.username}</Details>
            </Item>
            <Item>
                <Label>{'Project Duration'}</Label>
                <Details>{title.split(' in ')[1]}</Details>
            </Item>
            <Item>
                <Label>{'Starts'}</Label>
                <Details>{dateFormat(project.startAt, 'ddd mmm dS')}</Details>
            </Item>
            <Item>
                <Label>{'Ends'}</Label>
                <Details>{dateFormat(project.endAt, 'ddd mmm dS')}</Details>
            </Item>
            <Item>
                <Label>{'Number of contributors'}</Label>
                <Details>{project.contributors.length}</Details>
            </Item>
            <Item>
                <Label>{contributor?'Amount contributed':'Total amount contributed'}</Label>
                <Details>{contributor||userIsPunter?formatAmount(contributedAmount):'****'}</Details>
            </Item>
            {project.availableBalance > 0?
                <Item>
                    <Label>{'Available Balance'}</Label>
                    <Details>{contributor||userIsPunter?balance:'****'}</Details>
                </Item>:
                <Item>
                    <Label>{'Return on investment (ROI)'}</Label>
                    <Details>{`${contributor||userIsPunter?balance:'****'} (${formatNumber(percentIncrease)}%)`} </Details> :
                </Item>
            }
            <Item>
                <Label>{'Project Status'}</Label>
                <Details>{project.status.toUpperCase()}</Details>
            </Item>
        </Content>
    )
}

ContentDetailsList.propTypes = {
    project: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired
}

// Content
const Content = styled.div`
    flex-direction: column;
    align-items: start;
    padding: 10px;
`
const Item = styled.div`
    width: 100%;
    border-bottom: solid ${({theme})=>theme.colors.fainted};
    &:first-child{
        border-top: solid ${({theme})=>theme.colors.fainted};
    }
`
const Label = styled.p`
    color: ${({theme})=>theme.colors.dark2};
    font-size: 12px;
    text-transform: uppercase;
    margin: 10px 0;

`
const Details = styled.p`
    color: ${({theme})=>theme.colors.text};
    font-size: 16px;
    line-height: 1.3;
    margin: 0 0 10px;
`

export default ContentDetailsList