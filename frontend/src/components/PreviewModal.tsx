import React from 'react';
import { AnimationItemProps } from './AnimationItem';
import { API_URL } from '../apollo/client';
import { handleDownload, strokeLinejoin } from '../utils/appUtils';

interface PopupProps {
    onClose: () => void;
    selectedItem: AnimationItemProps,
    isOnline:boolean
};

const PreviewModal: React.FC<PopupProps> = ({ onClose, selectedItem, isOnline }) => {

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <div className="popup-header">
                    <h2>Preview Animation</h2>
                    <button className="close-button" onClick={onClose}>X</button>
                </div>
                <div className="popup-body card-body">
                    <div className='text-center'>
                        <div>
                            <img src={isOnline?API_URL + "/uploads/" + selectedItem.path:selectedItem.base64Image} />
                        </div>
                        <div>
                            <button onClick={() => handleDownload(selectedItem,isOnline)} className='download-btn'>
                            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#8899a4" strokeWidth="2" strokeLinecap="square" strokeLinejoin={strokeLinejoin}><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"></path></svg>
                            </button>
                        </div>
                    </div>
                    <div>
                        <strong>Name</strong><br /> <label>{selectedItem.name}</label>
                    </div>
                    <div>
                        <strong>Description</strong><br />
                        <summary>{selectedItem.description}</summary>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewModal;
