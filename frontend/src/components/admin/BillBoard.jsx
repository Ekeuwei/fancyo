import styled from "styled-components"
import { formatAmount, setAlpha } from "../../common/utils"

const BillBoard = () => {
  return (
    <ParentWrapper>
      {[1,2,3].map((item, index)=><Wrapper key={index}>
        <Title>Total Payout</Title>
        <Value>{formatAmount(1928383)}</Value>
        <DotWrapper>
          {[1,2,3].map((dot, idx) => (<Dot key={idx}/>))}
        </DotWrapper>
      </Wrapper>)}
    </ParentWrapper>
  )
}

const ParentWrapper = styled.div`
  display: flex;
  overflow: scroll;
`
const Wrapper = styled.div`
  background-color: ${({theme})=>theme.colors.primary};
  min-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  flex: 1;
  min-height: 200px;
`
const Title = styled.p`
  margin: 0;
  color: ${({theme})=>setAlpha(theme.colors.white, 0.9)};
  margin-bottom: 5px;
`
const Value = styled.h1`
  margin: 0;
  color: ${({theme})=>theme.colors.white};
  `
const Dot = styled.span`
  height: 7px;
  width: 7px;
  border-radius: 50%;
  background: ${({theme})=>theme.colors.white};
`
const DotWrapper = styled.div`
  display: flex;
  column-gap: 7px;
  margin-top: 10px;
`
export default BillBoard