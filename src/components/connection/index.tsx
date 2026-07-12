import { useState, useEffect } from 'react';
import { FloatingDiv } from '../Utils/floating-div';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlug, faWifi } from '@fortawesome/free-solid-svg-icons';
import Button from '../Button/button';

export default function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [close, setClose] = useState(false);

  useEffect(() => {
    // 1. Instant fallback triggers when cable/router drops entirely
    const handleOnline = () => checkTrueConnectivity();
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 2. Perform verification ping on component creation
    checkTrueConnectivity();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkTrueConnectivity = async () => {
    try {
      // Ping a highly available tiny text or favicon target with cache-busting
      const response = await fetch('https://google.com', { 
        mode: 'no-cors', 
        cache: 'no-store' 
      });
      if (response) {
        setIsOnline(true);
      }
    } catch (error) {
      // Triggered if DNS fails or request drops completely (router is on, but internet is dead)
      setIsOnline(false);
    }
  };

  return (
    <>
        { !isOnline && !close &&
            <FloatingDiv onClose={()=>setClose(true)}>
                <div className='flex flex-col justify-center items-center gap-5'>
                    <div>
                        <FontAwesomeIcon icon={faWifi} size='2xl' color='red'/>
                    </div>
                    <h1 className='text-center font-bold text-lg'>
                        No Internet Connection
                    </h1>
                    <p>Please check that you are connected to the Internet.</p>
                    <Button className='text-lg! ps-7! pr-7!' onClick={()=>location.reload()}>Reload</Button>
                </div>
            </FloatingDiv>
        }
    </>
    
  );
}
