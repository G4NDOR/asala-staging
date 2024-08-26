import React from 'react';
import Button from './Button';
import '../css/ButtonsContainer.css';

const ButtonsContainer = ({buttonsDetails, horizontal = false}) => {

  const classNameString = `buttons-container ${horizontal? 'buttons-container-horizontal' : ''}`;

  return (
    <div className={classNameString} >
      {/* Your buttons here */}
      {
        buttonsDetails.map((buttonDetails, i) =>
          <Button key={i} buttonDetails={buttonDetails} />
          
        )
      
      }
    </div>
  );
};

export default ButtonsContainer;

