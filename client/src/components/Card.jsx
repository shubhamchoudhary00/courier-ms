const Card = ({ imageUrl, count, label }) => {
    return (
      <div className='sub-containers' style={{ backgroundImage: `url(${imageUrl})` }}>
        <div className='sub-details d-flex'>
          <span>{count}</span>
          <span>{label}</span>
        </div>
      </div>
    );
  };

  export default Card;