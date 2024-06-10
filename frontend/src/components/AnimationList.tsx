import React, { useEffect, useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import AnimationItem, { AnimationItemProps } from './AnimationItem';
import UploadModal from './UploadModal';
import SearchBar from './SearchBar';
import { getAnimations, getUnsyncedAnimations, saveAnimation } from '../indexedDB';
import { GET_ANIMATIONS, UPLOAD_ANIMATION } from '../utils/graphql-commands';


const AnimationList: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { loading, error, data } = useQuery(GET_ANIMATIONS, {
    skip: !isOnline,
  });
  const [showPopup, setShowPopup] = useState(false);
  const [animationsData, setAnimationsData] = useState<AnimationItemProps[]>([]);
  const [localAnimations, setLocalAnimations] = useState<AnimationItemProps[]>([]);
  const [uploadAnimation] = useMutation(UPLOAD_ANIMATION);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const fetchLocalAnimations = async () => {
      const animations = await getAnimations();
      setAnimationsData(animations);
      setLocalAnimations(animations);
    };

    if (isOnline && data) {
      setAnimationsData(data.getAllAnimations);
    } else if (!isOnline) {
      fetchLocalAnimations();
    }
  }, [isOnline, data]);

  useEffect(() => {
    if (isOnline) syncAnimations();
  }, [isOnline]);

  const syncAnimations = async () => {
    let animations = await getUnsyncedAnimations();
    console.log(animations);
    animations.forEach(async (item) => {
      const { data } = await uploadAnimation({
        variables: { file: item.file, name: item.name, description: item.description },
      });
      let path = data.uploadAnimation.path;

      const updatedAnimations = animationsData.map(_item => {
        if (_item.id === item.id) {
          return { ..._item, path };
        }
        return _item;
      });
      setAnimationsData(updatedAnimations);
      await saveAnimation({
        ...item,
        path: path,
        uploaded: 1,
      });
    });
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;


  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleSearch = (data: AnimationItemProps[]) => {
    setAnimationsData(data);
  };
  const onSave = (item: AnimationItemProps) => {
    setAnimationsData([...animationsData, item]);
    setShowPopup(false);
  };

  return (
    <div>
      <div className='row'>
        <div className='col-md-3'>
          <SearchBar animations={localAnimations} isOnline={isOnline} onSearch={handleSearch} />
        </div>
        <div className='col-md-3'>
          <button className='btn btn-primary btn-sm' onClick={togglePopup}>
            <span> Add Animation</span>
          </button>
        </div>
      </div>
      {showPopup && (<UploadModal isOnline={isOnline} onSave={onSave} onClose={togglePopup} />)}
      <div className='row'>
        {animationsData && animationsData.map((animation: AnimationItemProps) => (
          <AnimationItem isOnline={isOnline} key={animation.id} animation={animation} />
        ))}
      </div>
    </div>
  );
};

export default AnimationList;
