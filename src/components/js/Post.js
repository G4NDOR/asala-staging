import React from "react";
import "../css/Post.css"; // Assuming you'll create a separate CSS file for Post styles

const Post = ({ imageSrc, title, description }) => {
  return (
    <div className="post-1">
      <img src={imageSrc} alt={title} />
      <div className="post-info">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default Post;
