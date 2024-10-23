import { useNavigate } from "react-router-dom";

const Card = ({ imageUrl, count, label,path }) => {
  const navigate=useNavigate()
    return (
      <div className='sub-containers' style={{ backgroundImage: `url(${imageUrl})` }} onClick={()=>navigate(path)}>
        <div className='sub-details d-flex'>
          <span>{count}</span>
          <span>{label}</span>
        </div>
      </div>
    );
  };

  export default Card;