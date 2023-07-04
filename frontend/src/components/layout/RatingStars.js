import React from 'react'

const RatingStars = ({rating}) => {
  return (
    <div className="rating-outer">
        <div className="rating-inner" style={{width: `${(rating / 5) * 100}%`}}></div>
    </div>
  )
}

export default RatingStars