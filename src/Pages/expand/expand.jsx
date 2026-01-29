import React, { useState } from 'react';

const Card = ({ title, content, color }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onMouseOver={() => setIsHovered(true)} 
      onMouseOut={() => setIsHovered(false)} 
      className={`card ${isHovered ? 'expanded' : ''} ${color}`}
    >
      <div className="card-title">{title}</div>
      <div className="card-content">
        {content.map((item, index) => (
          <a key={index} href={item.href}>{item.text}</a>
        ))}
      </div>
    </div>
  );
};

export default Card;