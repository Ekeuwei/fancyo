import styled from "styled-components"
import { Button, Loading } from "../../../theme/ThemeStyle"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheckCircle, faTimesCircle } from "@fortawesome/free-regular-svg-icons"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { api } from "../../../common/api"
import { clearUserErrors, createUserError } from "../../../app/user/userSlice"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

const TransacrionReceipt = () => {

  const dispatch = useDispatch()
  const history = useHistory()
  
  const { loading, error } = useSelector(state => state.user)

  const handleClosePayment = ()=>{
    history.push('/dashboard')
    dispatch(clearUserErrors())
  }

  useEffect(()=>{
    const urlParams = new URLSearchParams(window.location.search);
    const tx_ref = urlParams.get('tx_ref');
    const status = urlParams.get('status');
    const transaction_id = urlParams.get('transaction_id');

    if(status){
        dispatch(api.verifyTopup(`?status=${status}&tx_ref=${tx_ref}&transaction_id=${transaction_id}`));
    }else{
      dispatch(createUserError("Invalid State"))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

    return (
      <ReceiptWrapper>
        {loading? <Loading value="loading" />:
          <>
            <ReceiptWrapper value={loading?'loading':''}>

              <Icon value={error?"error":"successful"}>
                <FontAwesomeIcon icon={error?faTimesCircle:faCheckCircle} size="3x"/>
              </Icon>
              
              {error?<>
                <Title>Error</Title>
                <p>{error}</p>
              </>:<>
                <Title>Transaction Successful</Title>
                <p>Your deposit successfully completed</p>
              </>}

            </ReceiptWrapper>
            <GoBackButton onClick={handleClosePayment}>Back to dashboard</GoBackButton>
          </>
        }
      </ReceiptWrapper>
    )
}

const ReceiptWrapper = styled.div`
  display: ${({value})=>value==='loading'? 'none':'flex'};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  row-gap: 20px;
  padding: 30px;
  height: 100vh;
`

const GoBackButton = styled(Button)`
  margin-top: auto;
`
const Title = styled.h1`
  font-size: 20px;
`

const Icon = styled.div`
  color: ${({value, theme})=>value==="successful"?theme.colors.won:theme.colors.dark2};
`



export default TransacrionReceipt