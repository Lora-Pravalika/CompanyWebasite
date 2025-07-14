// src/Ui/profileAvatar.tsx
import React, { useRef, useState, useEffect } from 'react';
import { FaTimesCircle, FaCamera, FaTrash } from 'react-icons/fa';
import Cropper from 'react-easy-crop';
import getCroppedImg from './CropImage';
import './profileAvatar.css';

interface Props {
  onClose: () => void;
  onSaveImage: (image: string) => void;
  currentImage: string | null;
}

const API_BASE = 'https://aihr4u.onrender.com/api';

const ProfileModal: React.FC<Props> = ({ onClose, onSaveImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropping, setCropping] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [uploadedFilename, setUploadedFilename] = useState<string | null>(null);

  useEffect(() => {
    const savedUrl = localStorage.getItem('profileImageUrl');
    const savedFilename = localStorage.getItem('profileFilename');
    if (savedUrl) setPreview(savedUrl);
    if (savedFilename) setUploadedFilename(savedFilename);
  }, []);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setCropping(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const handleCancelCrop = () => {
    setCropping(false);
    setImageSrc(null);
  };

  const handleSaveCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) return alert('Not authenticated');

      const croppedBase64 = await getCroppedImg(imageSrc, croppedAreaPixels);
      const blob = await (await fetch(croppedBase64)).blob();
      const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });

      const formData = new FormData();
      formData.append('profile_picture', file);

      const method = uploadedFilename ? 'PUT' : 'POST';
      const endpoint = uploadedFilename ? 'update/' : 'create/';
      const url = `${API_BASE}/profile-photo/${endpoint}`;

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Upload failed:", errorText);
        alert("Upload failed");
        return;
      }

      const result = await response.json();

      if (!result.url || !result.filename) {
        alert('Upload failed');
        return;
      }

      localStorage.setItem('profileImageUrl', result.url);
      localStorage.setItem('profileFilename', result.filename);

      setPreview(result.url);
      setUploadedFilename(result.filename);
      onSaveImage(result.url);
      setCropping(false);
      setImageSrc(null);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed');
    }
  };

  const handleRemove = async () => {
    const token = localStorage.getItem('authToken');
    if (!token || !uploadedFilename) return;

    try {
      await fetch(`${API_BASE}/profile-photo/delete/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filename: uploadedFilename })
      });

      localStorage.removeItem('profileImageUrl');
      localStorage.removeItem('profileFilename');

      setPreview(null);
      setUploadedFilename(null);
      onSaveImage('');
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="close-icon" onClick={onClose}><FaTimesCircle /></div>

        <div className="profile-image-container">
          <div className="profile-image-wrapper">
            {preview ? (
              <img src={preview} className="profile-preview" alt="Preview" />
            ) : (
              <div className="placeholder-circle">No Image</div>
            )}
            <div className="camera-icon" onClick={handleUploadClick}><FaCamera /></div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>

        {!cropping ? (
          <div className="modal-actions">
            <button className="edit-btn" onClick={handleUploadClick}><FaCamera /> Upload Photo</button>
            {preview && <button className="remove-btn" onClick={handleRemove}><FaTrash /> Remove</button>}
          </div>
        ) : (
          <>
            <div className="cropper-wrapper">
              <Cropper
                image={imageSrc!}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            </div>
            <div className="crop-buttons">
              <button className="cancel-btn" onClick={handleCancelCrop}>Cancel</button>
              <button className="save-btn" onClick={handleSaveCrop}>Done</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
