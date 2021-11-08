import * as React from "react";
import * as Types from '../../types';

interface PropsTypes {
  options:(Types.options)
}

export const Button:React.FC<PropsTypes> = ({ options = {} }) => {

  const onClick = (key:string) => {
    console.log('\n\n\nonClick '+key+' options in popup\n\n\n',{ action: "set", key, value:!options[key] })
    chrome.runtime.sendMessage({ action: "set", key, value:!options[key] });
  };

  return (
    <div className="buttonContainer">
    <button className="snowButton" onClick={() => { onClick('KILL_POPUPS_AND_ADS')}}>
      {options.KILL_POPUPS_AND_ADS ? "Remove annoying popups and ads" : "Ignore (ok to show) popups and ads"}
    </button>
      <button className="snowButton" onClick={() => { onClick('SHOW_FLYSWATTER_ICON')}}>
        {options.SHOW_FLYSWATTER_ICON ? "Disable flyswatter icon" : "Enable flyswatter icon"}
      </button>
    </div>
  );
};

export default Button;