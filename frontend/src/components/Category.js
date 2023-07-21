import React, { Fragment, useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { getWorkers } from '../actions/workerActions'
import MetaData from './layout/MetaData'
import SearchComponent from './SearchComponent'

const Category = ({match}) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [rating, setRating] = useState(0)
    const category = match.params.name;
    const keyword = match.params.keyword;

    const alert = useAlert();

    const dispatch = useDispatch();
    const {  loading, workers, error, filteredWorkersCount } = useSelector(state => state.workers)
    

    useEffect(()=>{
        if(error){
            return  alert.error(error)
        }
        dispatch(getWorkers(keyword, currentPage,"","","", category, rating))
    }, [dispatch, category, currentPage, rating, error, keyword, alert]);

    return (
        <Fragment>
            <MetaData>{category}</MetaData>
            <SearchComponent setCurrentPage={setCurrentPage} setRating={setRating} loading={loading} workers = {workers} count = {filteredWorkersCount} />
        </Fragment>
    )
}

export default Category