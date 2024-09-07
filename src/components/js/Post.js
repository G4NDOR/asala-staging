import React, { useEffect, useState } from "react";
import DEFAULT_VALUES from "../../constants/defaultValues";
import { getImages } from "../../utils/firestoreUtils";
import "../css/Post.css"; // Assuming you'll create a separate CSS file for Post styles

const Post = ({ imageRef, title, description }) => {
  const [initialized, setInitialized] = useState(false);
  const [image, setImage] = useState(DEFAULT_VALUES.IMAGE);

  const initialize = async () => {
    const imagePath = imageRef;
    const images = await getImages([imagePath]);
    if(images) setImage(images[0]);
    setInitialized(true);
  }

  useEffect(() => {
    if(!initialized) initialize();
  
    return () => {
      
    }
  }, [])
  


  return (
    <div className="post-1">
      <img src={image} alt={title} />
      <div className="post-info">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default Post;
