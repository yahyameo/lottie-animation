import React, { useState } from 'react';
import { API_URL } from '../apollo/client';
import PreviewModal from './PreviewModal';
import { handleDownload, strokeLinejoin } from '../utils/appUtils';
import { Player } from '@lottiefiles/react-lottie-player';

export interface AnimationItemProps {
  id: string;
  name: string;
  description: string;
  fileName: string;
  path: string;
  base64Image: string | undefined
}
const AnimationItem: React.FC<{ animation: AnimationItemProps, isOnline: boolean }> = ({ animation, isOnline }) => {
  const [showPopup, setShowPopup] = useState(false);
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (<div style={{ width: "214px", height: "246px" }} className="p-3">
    <div onClick={togglePopup} className='box'>
      {animation && <Player
        autoplay
        loop
        className="lottie-img"
        src={isOnline ? (API_URL + "/uploads/" + (animation.path ?? "")) : (animation.base64Image ?? "")}
      />}
    </div>
    <div style={{ width: "185px", marginTop: "5px" }}>
      <span>
        {animation.name}
      </span>
      <button onClick={() => handleDownload(animation, isOnline)} className='download-btn pull-right'>
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#8899a4" strokeWidth="2" strokeLinecap="square" strokeLinejoin={strokeLinejoin}><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"></path></svg>
      </button>
    </div>
    {showPopup && (<PreviewModal isOnline={isOnline} onClose={togglePopup} selectedItem={animation} />)}
  </div>)
};

export default AnimationItem;
