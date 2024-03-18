import styled from 'styled-components'
import PropTypes from 'prop-types'
import dateFormat from 'dateformat'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NewProjectPreview = ({project}) => {
    const difference = new Date(project.endAt).getTime() - new Date().getTime(project.startAt);
    const duration = Math.floor(difference / (1000 * 60 * 60 * 24)) + 1;
    const notes = `This project runs from ${dateFormat(project.startAt, 'mmmm dd')} to ${dateFormat(project.endAt, 'mmmm dd, yyyy')}, promising a ${project.eRoi}% Return on Investment (ROI). Throughout the progress of this project, odds per bet ticket will vary from ${parseFloat(project.minOdds).toFixed(2)} to ${parseFloat(project.maxOdds).toFixed(2)} odds. ${project.progressiveStaking?"We're using a progressive staking strategy to manage the bankroll effectively.":''}`

    return (
        <Content>
            <Item>
                <ItemDetails>
                    <Label>{'Description'}</Label>
                    <Details>{project.notes||notes}</Details>
                </ItemDetails>
            </Item>
            <Item>
                <ItemDetails>
                    <Label>{'Project Duration'}</Label>
                    <Details>{`${duration} Day${duration>1?'s':''}`}</Details>
                </ItemDetails>
            </Item>
            {project.progressiveStaking?
                <Item>
                    <ItemDetails>
                        <Label>{'Staking Strategy'}</Label>
                        <Details>Progressive ({project.progressiveSteps} steps)</Details>
                    </ItemDetails>
                </Item>:
                <Item>
                    <ItemDetails>
                        <Label>Staking Pattern</Label>
                        <Details>Unspecified</Details>
                    </ItemDetails>
                </Item>}
            <Item>
                <ItemDetails>
                    <Label>Odds range per ticket</Label>
                    <Details>{parseFloat(project.minOdds).toFixed(2)} - {parseFloat(project.maxOdds).toFixed(2)}</Details>
                </ItemDetails>
            </Item>
            <Item>
                <ItemDetails>
                    <Label>ROI</Label>
                    <Details>Estimated at {project.eRoi}%</Details>
                </ItemDetails>
            </Item>
            <Item>
                <ItemDetails>
                    <Label>{'Starts'}</Label>
                    <Details>{dateFormat(project.startAt, 'ddd mmm dS')}</Details>
                </ItemDetails>
            </Item>
            <Item>
                <ItemDetails>
                    <Label>{'Ends'}</Label>
                    <Details>{dateFormat(project.endAt, 'ddd mmm dS')}</Details>
                </ItemDetails>
            </Item>
        </Content>
    )
}

NewProjectPreview.propTypes = {
    project: PropTypes.object.isRequired,
}

// Content
const Content = styled.div`
    flex-direction: column;
    align-items: start;
    padding: 0 10px;
`
const Item = styled.div`
    width: 100%;
    display: flex;
    margin-top: 10px;
    align-items: center;
    border-bottom: solid ${({theme})=>theme.colors.fainted};
    &:first-child{
        border-top: solid ${({theme})=>theme.colors.fainted};
    }
`
const ItemDetails = styled.div`
`
// eslint-disable-next-line no-unused-vars
const Icon = styled(FontAwesomeIcon)`
    color: ${({theme})=> theme.colors.accent};
    margin-right: 10px;
`
const Label = styled.p`
    color: ${({theme})=>theme.colors.dark2};
    font-size: 12px;
    text-transform: uppercase;
    margin: 5px 0;

`
const Details = styled.p`
    color: ${({theme})=>theme.colors.text};
    font-size: 16px;
    line-height: 1.3;
    margin: 0 0 5px;
`

export default NewProjectPreview