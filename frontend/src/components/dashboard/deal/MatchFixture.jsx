import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import dateFormat from 'dateformat'
import { faHourglassHalf } from '@fortawesome/free-solid-svg-icons'

const MatchFixture = ({fixture}) => {
  return (
    <FixturWrapper>
        <Icon value={fixture.scores.ft===''?'warning':fixture.outcome==1?'won':'lost'}>
            <FontAwesomeIcon icon={fixture.scores.ft===''?faHourglassHalf:fixture.outcome==1?faCheckCircle:faTimesCircle} size='lg' />
        </Icon>
        <Match>
            <TextField>{`${fixture.league} | ${dateFormat(fixture.time, 'dd/mm/yyyy - HH:mm')}`}</TextField>
            <Wrapper>
                <TextField>{fixture.homeTeam}</TextField>
                <Scores>{fixture.scores?.ft || 'Vs'}</Scores>
                <TextField>{fixture.awayTeam}</TextField>
            </Wrapper>
            <Wrapper>
                <TextField>{`${fixture.prediction} @${fixture.odds}`}</TextField>
            </Wrapper>
        </Match>
    </FixturWrapper>
  )
}
MatchFixture.propTypes = {
    fixture: PropTypes.object
}

const FixturWrapper = styled.div`
    display: flex;
    align-items: center;
    border-radius: 5px;
    padding: 5px;
    background-color: ${({theme})=>theme.colors.bg};
`
const Match = styled.div`
    display: flex;
    flex-direction: column;
`
const Wrapper = styled.div`
    display: flex;
    align-items: center;
    margin-top: 2px;
`
const TextField = styled.p`
    font-size: 12px;
    margin: 0;
`
const Icon = styled.div`
    margin: 0 10px;
    padding: 5px;
    color: ${({theme, value})=> theme.colors[value]};
`
const Scores = styled(TextField)`
    padding: 2px 8px;
    letter-spacing: 1.5px;
    background-color: ${({theme})=>theme.colors.dark2};
    color: ${({theme})=>theme.colors.white};
    border-radius: 5px;
    margin: 0 5px;
`

export default MatchFixture