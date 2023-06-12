import React, { useState } from 'react';

const StarRating = ({rating, setRating}) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleStarHover = hoveredStar => setHoveredRating(hoveredStar);

  const handleStarClick = selectedStar => setRating(selectedStar);
  
  return (
    <div className='stars'>
      {[...Array(5)].map((_, index) => {
        const starNumber = index + 1;
        const overed = starNumber <= hoveredRating;
        const rated = starNumber <= rating;

        return (
          <span
            key={starNumber}
            className={`star ${rated?'orange':''} ${overed ? 'yellow' : ''}`}
            onMouseEnter={() => handleStarHover(starNumber)}
            onMouseLeave={() => handleStarHover(0)}
            onClick={() => handleStarClick(starNumber)}
          >
            &#9733;
          </span>
        );
      })}
    </div>
  );
}

export default StarRating;
