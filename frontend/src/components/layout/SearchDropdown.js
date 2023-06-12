import Fuse from 'fuse.js'
import { useState } from 'react';

const SearchDropdown = ({ value, onChange, suggestions, placeholder, name, validateField, handleKeyDown, itemSelected })=>{

    const options = { keys: ['name'], threshold: 0.4 }
    const fuse =  new Fuse(suggestions, options)
    let filteredSuggestions = suggestions;
    
    if(value && value.name){
        filteredSuggestions = fuse.search(value.name).map(result => result.item)
    }
    
    const [showSuggestions, setShowSuggestions] = useState(false);

    
    const handleBlur = ()=>{
        const validValue = suggestions.find(s => s.name.toLowerCase()===value.name.toLowerCase())
        const validItem = typeof validValue === 'object' && validValue !== null
        if(validateField){
            onChange(validItem? validValue : {name: ''}, name)
        }
        setShowSuggestions(false)
    }

    return (
        <div style={{flex:1}} 
            onFocus={()=>setShowSuggestions(true)} 
            onBlur={handleBlur} >
            
            <input
                type="text"
                value={value.name}
                onChange={ e => onChange({name: e.target.value}, name)}
                placeholder={placeholder}
                onKeyDown={handleKeyDown}
            />

            <div className="suggestions">
                { showSuggestions && filteredSuggestions && (
                    <ul>
                    {filteredSuggestions.map((suggestion, index) => (
                        <li key={index} onMouseDown={()=> itemSelected(suggestion, name)}>
                            {suggestion.name}
                        </li>
                        ))}
                    </ul>
                )}
            </div>
            {/* <i className="fa fa-caret-down ms-auto" aria-hidden="true"></i> */}
        </div>

    )
}

export default SearchDropdown