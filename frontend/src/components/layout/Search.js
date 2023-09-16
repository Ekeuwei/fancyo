import React, { useState } from 'react'

const Search = ({ history }) => {

    const [keyword, setKeyword] = useState('');

    const searchHandler = (e) => {
        e.preventDefault()

        if(keyword.trim()){
            history.push(`/search/${keyword}`)
        } else {
            history.push('/')
        }
    }

    return (
        <form className='my-2' onSubmit = { searchHandler } >
            <div className="input-group bg-dark-4 rounded-pill" style={{minHeight: '50px'}}>
                <span className="input-group-text ms-2 border-0 bg-transparent">
                    <span className="text-white my-auto fa fa-search"></span>
                </span>
                <input 
                    type="text" 
                    className="form-control ps-1 border-0 bg-transparent shadow-none text-dark-3" 
                    placeholder="Find a worker" 
                    aria-label="keyword"
                    value= {keyword}
                    aria-describedby="basic-addon1"
                    onChange = {(e) => setKeyword(e.target.value)}
                />
                <button 
                    type="submit" 
                    className="btn px-3 bg-primary-2 rounded-pill text-white">
                    Search
                </button>
            </div>
        </form>
    )
}

export default Search
