import React from 'react';
import { generateButtonDetails } from '../../utils/appUtils';
import '../css/Button.css';

const Button = ({ buttonDetails}) => {
  const _buttonDetails = generateButtonDetails(buttonDetails);
  const active = _buttonDetails.active;
  const notActive = !active;
  const visible = _buttonDetails.visible;
  const generalContent = _buttonDetails.generalContent;
  const activeContent = _buttonDetails.activeContent;
  const notActiveCotent = _buttonDetails.notActiveContent;
  const generalClassName = _buttonDetails.generalClassName;
  const activeClassName = _buttonDetails.activeClassName;
  const notActiveClassName = _buttonDetails.notActiveClasName;
  const activeAction = _buttonDetails.activeAction;
  const notActiveAction = _buttonDetails.notActiveAction;
  const params = _buttonDetails.params;
  const classNameString = `button ${generalClassName} ${active ? activeClassName: notActiveClassName} ${visible? '': 'button-invisible'}  `;
  const contentString = `${generalContent} ${active ? activeContent : notActiveCotent}`;


  const action = active ? activeAction : notActiveAction;

  const handleClick = () => {
    action(params);
  }


  return (
    <button 
      className={classNameString}
      disabled={notActive}
      onClick={handleClick}
    >
      {contentString}
    </button>
  );
};


export default Button;

