import styled from 'styled-components'
import PropTypes from 'prop-types'
import dateFormat from 'dateformat'
import { formatAmountFraction } from '../../../common/utils'

const ContentDetailsList = ({project, title}) => {
    const contributedAmount = project.contributors.reduce((acc, contributor)=>acc+contributor.amount, 0)
  return (
    <Content>
        {project.notes&&<Item>
            <Label>{'Description'}</Label>
            <Details>{project.notes}</Details>
        </Item>}
        <Item>
            <Label>{'Author'}</Label>
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
            <Label>{'Contributors'}</Label>
            <Details>{project.contributors.length}</Details>
        </Item>
        <Item>
            <Label>{'Amount Contributed'}</Label>
            <Details>{formatAmountFraction(contributedAmount)}</Details>
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

`
const Details = styled(Label)`
    color: ${({theme})=>theme.colors.text};
    font-size: 14px;
    margin-top: 0;
`

export default ContentDetailsList