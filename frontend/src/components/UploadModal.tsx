import { useMutation } from '@apollo/client';
import React, { useRef, useState } from 'react';
import { AnimationItemProps } from './AnimationItem';
import { saveAnimation } from '../indexedDB';
import { UPLOAD_ANIMATION } from '../utils/graphql-commands';

interface PopupProps {
    onClose: () => void;
    onSave: (item: AnimationItemProps) => void,
    isOnline: boolean
};

const UploadModal: React.FC<PopupProps> = ({ onClose, onSave, isOnline }) => {

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploadAnimation] = useMutation(UPLOAD_ANIMATION);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files ? e.target.files[0] : null;
        setFile(selectedFile);

        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setPreview(null);
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !name) return;
        try {
            let payload: any = { id: new Date().getTime(), file, name, description, fileName: file.name };
            if (isOnline) {
                const { data } = await uploadAnimation({
                    variables: { file, name, description },
                });
                payload = data.uploadAnimation;
            }
            handleImageUpload(payload);
        } catch (error) {
            console.error('Error uploading animation:', error);
        }
    };
    const handleImageUpload = (animation: AnimationItemProps) => {
        const reader = new FileReader();
        reader.onload = async () => {
            const base64Image = reader?.result?.toString();
            await saveAnimation({ ...animation, base64Image, uploaded: isOnline ? 1 : 0 });
            onSave({ ...animation, base64Image });
        };
        if (file) reader.readAsDataURL(file);
    };
    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <div className="popup-header">
                    <h2>Upload Animation</h2>
                    <button className="close-button" onClick={onClose}>X</button>
                </div>
                <div className="popup-body card-body">
                    <div className="form-row text-center">
                        <div className='form-group col-md-12'>
                            {preview && <img src={preview} alt="Preview" className="image-preview lottie-img" />}
                        </div>
                        <div className="form-group col-md-12">
                            <input ref={fileInputRef} hidden type="file" onChange={handleFileChange} required />
                            <button type="button" onClick={handleButtonClick} className="btn btn-primary btn-sm"> Browse Photo</button>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <label><span >*</span> Name</label>
                            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required type="text" className="form-control" />
                            {!name && (<div style={{ color: "red" }}> This field is required </div>)}
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <label>Description</label>
                            <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" type="text" className="form-control" />
                        </div>
                    </div>
                    <div className='form-row'>
                        <div className="form-group col-md-12">
                            <button className='btn btn-primary pull-right' onClick={handleSubmit} type="submit">Upload</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadModal;
