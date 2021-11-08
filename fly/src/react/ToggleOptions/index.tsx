import * as React from "react";
import EnableFlyswatterIcon from "./EnableFlyswatterIcon";
import "./style.scss";
import * as Types from '../../types';
import defaultOptions from '../../data/options';

const ToggleOptions = () => {
  /*
  * State
  */
  const [options, setOptions] = React.useState<Types.options>(defaultOptions);
  React.useEffect(() => {
    // initially, get data
    for (let key in options) {
      chrome.storage.local.get(key, (result) => {
        options[key] = result[key] || options[key];
      });
    }
    setOptions({ ...options });
    // on update, set data
    chrome.runtime.onMessage.addListener((message) => {
      options[message.key] = message.value;
      setOptions({ ...options });
    });
  }, []);

  /*
  * View
  */
  return (
    <div>
      <EnableFlyswatterIcon options={options} />
    </div>
  );
};

export default ToggleOptions;
