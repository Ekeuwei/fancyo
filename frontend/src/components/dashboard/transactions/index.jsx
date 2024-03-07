import NavHeader from '../layout/NavHeader'
import { BodyWrapper, Loading } from '../../../theme/ThemeStyle'
import Transaction from './Transaction'
import styled from 'styled-components'
import FilterTransactions from './FilterTransactions'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { api } from '../../../common/api'

const index = () => {
    const dispatch = useDispatch()

    const { loading, error, transactions } = useSelector(state=> state.user)

    useEffect(()=>{
        dispatch(api.myTransactions())
    }, [])

  return (
    <div>
        <NavHeader title={'Transactions'} />
        <FilterTransactions />
        <BodyWrapper>
            {transactions&& <Wrapper>
                {transactions.map(transactions =>(<Transaction key={transactions.reference} transaction={transactions} />))}
            </Wrapper>}
            <Loading value={+loading}/>
        </BodyWrapper>
    </div>
  )
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: 5px;
`

export default index