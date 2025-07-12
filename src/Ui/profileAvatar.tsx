import React, { useRef, useState } from 'react';
import { FaTimesCircle, FaCamera, FaTrash } from 'react-icons/fa';
import Cropper from 'react-easy-crop';
import getCroppedImg from './CropImage';
import './profileAvatar.css';

interface Props {
  onClose: () => void;
  onSaveImage: (image: string) => void;
  currentImage: string | null;
}

const API_BASE = 'http://localhost:8000'; // your backend URL

const ProfileModal: React.FC<Props> = ({ onClose, onSaveImage, currentImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImage);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropping, setCropping] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [uploadedFilename, setUploadedFilename] = useState<string | null>(null);

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
      const croppedBase64 = await getCroppedImg(imageSrc, croppedAreaPixels);

      // Convert base64 to blob
      const blob = await (await fetch(croppedBase64)).blob();
      const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });

      // Send to backend
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE}/upload-avatar/`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      const imageUrl = `${API_BASE}/uploads/${result.filename}`;

      setPreview(imageUrl);
      setUploadedFilename(result.filename);
      onSaveImage(imageUrl);
      setCropping(false);
      setImageSrc(null);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const handleRemove = async () => {
    if (uploadedFilename) {
      try {
        await fetch(`${API_BASE}/delete-avatar/${uploadedFilename}`, {
          method: 'DELETE',
        });
      } catch (err) {
        console.error('Failed to delete image:', err);
      }
    }

    setPreview(null);
    setUploadedFilename(null);
    onSaveImage('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="close-icon" onClick={onClose}>
          <FaTimesCircle />
        </div>

        <div className="profile-image-container">
          <div className="profile-image-wrapper">
            {preview ? (
              <img src={preview} className="profile-preview" />
            ) : (
              <div className="placeholder-circle">No Image</div>
            )}
            <div className="camera-icon" onClick={handleUploadClick}>
              <FaCamera />
            </div>
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
            <button className="edit-btn" onClick={handleUploadClick}>
              <FaCamera /> Upload Photo
            </button>
            <button className="remove-btn" onClick={handleRemove}>
              <FaTrash /> Remove
            </button>
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
