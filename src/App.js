import React, { useState, useEffect, useRef } from 'react';
import { Swords, Footprints, Eye, Zap } from 'lucide-react';

const DragonDungeonGame = () => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [subMessage, setSubMessage] = useState('');
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [showJumpPrompt, setShowJumpPrompt] = useState(false);
  const [showShakePrompt, setShowShakePrompt] = useState(false);
  const [dragonEyeOpen, setDragonEyeOpen] = useState(false);
  const [isSquatting, setIsSquatting] = useState(false);
  
  const stepCountRef = useRef(0);
  const lastAccelRef = useRef({ x: 0, y: 0, z: 0 });
  const slashCountRef = useRef(0);
  const jumpTimerRef = useRef(null);
  const shakeTimerRef = useRef(null);
  const eyeTimerRef = useRef(null);
  const squatTimeoutRef = useRef(null);

  const vibrate = (duration = 200) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(duration);
    }
  };

  const requestPermission = async () => {
    try {
      if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        const permission = await DeviceMotionEvent.requestPermission();
        if (permission === 'granted') {
          setIsPermissionGranted(true);
          startGame();
        }
      } else {
        setIsPermissionGranted(true);
        startGame();
      }
    } catch (error) {
      console.error('Sensor permission error:', error);
      alert('Sensör izni alınamadı. Lütfen tarayıcı ayarlarınızı kontrol edin.');
    }
  };

  const startGame = () => {
    setStep(1);
    setProgress(0);
    stepCountRef.current = 0;
    slashCountRef.current = 0;
  };

  useEffect(() => {
    if (step !== 1 || !isPermissionGranted) return;

    setMessage('Ejderha zindanı yolundasın zindana ulaşmak için bar dolana kadar koş');
    
    const handleMotion = (event) => {
      const accel = event.accelerationIncludingGravity;
      if (!accel) return;

      const totalAccel = Math.sqrt(
        Math.pow(accel.x - lastAccelRef.current.x, 2) +
        Math.pow(accel.y - lastAccelRef.current.y, 2) +
        Math.pow(accel.z - lastAccelRef.current.z, 2)
      );

      if (totalAccel > 15) {
        stepCountRef.current++;
        setProgress((stepCountRef.current / 25) * 100);
        
        if (stepCountRef.current >= 25) {
          vibrate(300);
          setStep(2);
          setProgress(0);
          slashCountRef.current = 0;
        }
      }

      lastAccelRef.current = { x: accel.x, y: accel.y, z: accel.z };
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [step, isPermissionGranted]);

  useEffect(() => {
    if (step !== 2 || !isPermissionGranted) return;

    setMessage('Zindanın kapısında Kızıl orklar var önce onları yok etmeliyis.');
    setSubMessage('Kılıcını çek *telefonu sağ eline al* telefon titreyene kadar onları kılıçtan geçir');
    slashCountRef.current = 0;

    const handleMotion = (event) => {
      const accel = event.accelerationIncludingGravity;
      if (!accel) return;

      const totalAccel = Math.sqrt(
        Math.pow(accel.x, 2) + Math.pow(accel.y, 2) + Math.pow(accel.z, 2)
      );

      if (totalAccel > 20) {
        slashCountRef.current++;
        setProgress((slashCountRef.current / 10) * 100);
        vibrate(50);
        
        if (slashCountRef.current >= 10) {
          vibrate(300);
          setStep(2.5);
          setProgress(0);
          slashCountRef.current = 0;
        }
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [step, isPermissionGranted]);

  useEffect(() => {
    if (step !== 2.5 || !isPermissionGranted) return;

    setMessage('Yarısını yok ettin şimdi kılıcını sol eline al ve titreneyene kadar onları kılıçtan geçir');
    setSubMessage('');
    slashCountRef.current = 0;

    const handleMotion = (event) => {
      const accel = event.accelerationIncludingGravity;
      if (!accel) return;

      const totalAccel = Math.sqrt(
        Math.pow(accel.x, 2) + Math.pow(accel.y, 2) + Math.pow(accel.z, 2)
      );

      if (totalAccel > 20) {
        slashCountRef.current++;
        setProgress((slashCountRef.current / 10) * 100);
        vibrate(50);
        
        if (slashCountRef.current >= 10) {
          vibrate(300);
          setStep(3);
          setProgress(0);
          stepCountRef.current = 0;
        }
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [step, isPermissionGranted]);

  useEffect(() => {
    if (step !== 3 || !isPermissionGranted) return;

    setMessage('İçeri girdin ileride kristal ejder uyuyor fakat uykusu çok hafif, sen adım attıkça kristal ejdere doğru yaklaşacaksın');
    setSubMessage('Eğer gözlerini açarsa hemen çökerek gözlerini kapatana kadar sessizce bekle. Yoksa YANARSIN!');
    stepCountRef.current = 0;
    setDragonEyeOpen(false);

    const scheduleEyeOpen = () => {
      const delay = Math.random() * 5000 + 5000;
      eyeTimerRef.current = setTimeout(() => {
        if (step === 3) {
          setDragonEyeOpen(true);
          vibrate(100);
          
          setTimeout(() => {
            setDragonEyeOpen(false);
            setIsSquatting(false);
            if (step === 3) scheduleEyeOpen();
          }, 5000);
        }
      }, delay);
    };

    scheduleEyeOpen();

    const handleMotion = (event) => {
      const accel = event.accelerationIncludingGravity;
      if (!accel) return;

      if (dragonEyeOpen && !isSquatting) {
        const totalAccel = Math.sqrt(
          Math.pow(accel.x - lastAccelRef.current.x, 2) +
          Math.pow(accel.y - lastAccelRef.current.y, 2) +
          Math.pow(accel.z - lastAccelRef.current.z, 2)
        );

        if (totalAccel > 15) {
          vibrate([200, 100, 200]);
          alert('Ejderha seni gördü! YANDIN! Oyun baştan başlıyor...');
          setStep(1);
          setProgress(0);
          return;
        }
      }

      if (dragonEyeOpen && Math.abs(accel.z) > 15) {
        setIsSquatting(true);
      }

      if (!dragonEyeOpen) {
        const totalAccel = Math.sqrt(
          Math.pow(accel.x - lastAccelRef.current.x, 2) +
          Math.pow(accel.y - lastAccelRef.current.y, 2) +
          Math.pow(accel.z - lastAccelRef.current.z, 2)
        );

        if (totalAccel > 15) {
          stepCountRef.current++;
          setProgress((stepCountRef.current / 40) * 100);
          
          if (stepCountRef.current >= 40) {
            vibrate(300);
            clearTimeout(eyeTimerRef.current);
            setStep(4);
            setProgress(0);
            slashCountRef.current = 0;
          }
        }
      }

      lastAccelRef.current = { x: accel.x, y: accel.y, z: accel.z };
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
      clearTimeout(eyeTimerRef.current);
    };
  }, [step, isPermissionGranted, dragonEyeOpen, isSquatting]);

  useEffect(() => {
    if ((step !== 4 && step !== 6 && step !== 9) || !isPermissionGranted) return;

    setMessage('Kristal Ejderin yanına geldin şimdi kılıcını kaldırıp bütün gücünle çökerek vur');
    setSubMessage('*telefonu fırlatma* Kılıcın titreyene kadar vurmayı bırakma');
    slashCountRef.current = 0;

    const handleMotion = (event) => {
      const accel = event.accelerationIncludingGravity;
      if (!accel) return;

      const totalAccel = Math.sqrt(
        Math.pow(accel.x, 2) + Math.pow(accel.y, 2) + Math.pow(accel.z, 2)
      );

      if (totalAccel > 25) {
        slashCountRef.current++;
        setProgress((slashCountRef.current / 10) * 100);
        vibrate(80);
        
        if (slashCountRef.current >= 10) {
          vibrate(300);
          setProgress(0);
          slashCountRef.current = 0;
          
          if (step === 4) setStep(5);
          else if (step === 6) setStep(7);
          else if (step === 9) setStep(10);
        }
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [step, isPermissionGranted]);

  useEffect(() => {
    if ((step !== 5 && step !== 8) || !isPermissionGranted) return;

    setMessage('Dikkat Ejder kuyruğuyla sana saldırmak üzere.');
    setSubMessage('Ekranda zıpla yazdığında geç kalmadan zıpla.');
    slashCountRef.current = 0;

    const scheduleJump = () => {
      jumpTimerRef.current = setTimeout(() => {
        setShowJumpPrompt(true);
        vibrate(100);
        
        squatTimeoutRef.current = setTimeout(() => {
          if (showJumpPrompt) {
            vibrate([200, 100, 200]);
            alert('Çok yavaş kaldın! Ejderhanın kuyruğu sana çarptı! Oyun baştan başlıyor...');
            setStep(1);
            setProgress(0);
          }
        }, 4000);
        
      }, 8000);
    };

    scheduleJump();

    const handleMotion = (event) => {
      const accel = event.accelerationIncludingGravity;
      if (!accel) return;

      const totalAccel = Math.sqrt(
        Math.pow(accel.x, 2) + Math.pow(accel.y, 2) + Math.pow(accel.z, 2)
      );

      if (showJumpPrompt && totalAccel > 25) {
        slashCountRef.current++;
        setProgress((slashCountRef.current / 5) * 100);
        setShowJumpPrompt(false);
        clearTimeout(squatTimeoutRef.current);
        vibrate(50);
        
        if (slashCountRef.current >= 5) {
          vibrate(300);
          clearTimeout(jumpTimerRef.current);
          setProgress(0);
          
          if (step === 5) setStep(6);
          else if (step === 8) setStep(9);
        } else {
          scheduleJump();
        }
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
      clearTimeout(jumpTimerRef.current);
      clearTimeout(squatTimeoutRef.current);
    };
  }, [step, isPermissionGranted, showJumpPrompt]);

  useEffect(() => {
    if (step !== 7 || !isPermissionGranted) return;

    setMessage('Ejder sersemledi. Fakat zindanın içinde gölge doğanlar belirdi');
    setSubMessage('Telefonu 2 elinle tut. Ekranda salla yazınca 1 kere salla. Gölge doğanlar hızlıdır çabuk reaksiyon vermelisin. Ejderha uyanmadan hepsini yok et');
    slashCountRef.current = 0;

    const scheduleShake = () => {
      shakeTimerRef.current = setTimeout(() => {
        setShowShakePrompt(true);
        vibrate(100);
        
        squatTimeoutRef.current = setTimeout(() => {
          if (showShakePrompt) {
            vibrate([200, 100, 200]);
            alert('Çok yavaş kaldın! Gölge doğan sana saldırdı! Oyun baştan başlıyor...');
            setStep(1);
            setProgress(0);
          }
        }, 1000);
        
      }, 8000);
    };

    scheduleShake();

    const handleMotion = (event) => {
      const accel = event.accelerationIncludingGravity;
      if (!accel) return;

      const totalAccel = Math.sqrt(
        Math.pow(accel.x - lastAccelRef.current.x, 2) +
        Math.pow(accel.y - lastAccelRef.current.y, 2) +
        Math.pow(accel.z - lastAccelRef.current.z, 2)
      );

      if (showShakePrompt && totalAccel > 15) {
        slashCountRef.current++;
        setProgress((slashCountRef.current / 8) * 100);
        setShowShakePrompt(false);
        clearTimeout(squatTimeoutRef.current);
        vibrate(50);
        
        if (slashCountRef.current >= 8) {
          vibrate(300);
          clearTimeout(shakeTimerRef.current);
          setProgress(0);
          setStep(8);
        } else {
          scheduleShake();
        }
      }

      lastAccelRef.current = { x: accel.x, y: accel.y, z: accel.z };
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
      clearTimeout(shakeTimerRef.current);
      clearTimeout(squatTimeoutRef.current);
    };
  }, [step, isPermissionGranted, showShakePrompt]);

  const getStepIcon = () => {
    if (step === 1) return <Footprints className="w-12 h-12" />;
    if (step === 2 || step === 2.5 || step === 4 || step === 6 || step === 9) return <Swords className="w-12 h-12" />;
    if (step === 3) return <Eye className="w-12 h-12" />;
    if (step === 5 || step === 8) return <Zap className="w-12 h-12" />;
    if (step === 7) return <Zap className="w-12 h-12" />;
    return null;
  };

  if (!isPermissionGranted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg p-8 max-w-md text-center">
          <Swords className="w-24 h-24 mx-auto mb-6 text-red-500" />
          <h1 className="text-3xl font-bold text-white mb-4">Ejderha Zindanı</h1>
          <p className="text-gray-300 mb-6">
            Bu oyun telefonunuzun hareket sensörlerini kullanır. Telefonu bir kılıç gibi kullanacaksınız!
          </p>
          <button
            onClick={requestPermission}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-lg"
          >
            Maceraya Başla
          </button>
        </div>
      </div>
    );
  }

  if (step === 10) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-400 via-orange-500 to-red-600 flex items-center justify-center p-4">
        <div className="bg-gray-900 bg-opacity-90 rounded-lg p-8 max-w-md text-center">
          <h1 className="text-5xl font-bold text-yellow-400 mb-6">🏆 KAZANDIN! 🏆</h1>
          <p className="text-white text-xl mb-8">
            Kristal Ejderi yendin ve zindanın efendisi oldun!
          </p>
          <button
            onClick={() => {
              setStep(1);
              setProgress(0);
              stepCountRef.current = 0;
              slashCountRef.current = 0;
            }}
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg"
          >
            Tekrar Oyna
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-red-900 to-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <div className="w-full bg-gray-700 rounded-full h-6 overflow-hidden">
            <div
              className="bg-gradient-to-r from-red-500 to-orange-500 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-4 min-h-[200px] flex flex-col items-center justify-center text-center">
          <div className="text-red-500 mb-4">
            {getStepIcon()}
          </div>
          
          <p className="text-white text-lg font-semibold mb-3">{message}</p>
          {subMessage && <p className="text-gray-300 text-sm">{subMessage}</p>}
          
          {step === 3 && (
            <div className="mt-6">
              <div className={`text-6xl transition-all duration-300 ${dragonEyeOpen ? 'text-red-500 animate-pulse' : 'text-gray-600'}`}>
                {dragonEyeOpen ? '👁️' : '😴'}
              </div>
              {dragonEyeOpen && (
                <p className="text-red-400 font-bold mt-2 animate-pulse">ÇÖK VE BEKLE!</p>
              )}
              {isSquatting && dragonEyeOpen && (
                <p className="text-green-400 font-bold mt-2">✓ İyi gidiyorsun...</p>
              )}
            </div>
          )}
          
          {showJumpPrompt && (
            <div className="mt-6">
              <p className="text-yellow-400 text-4xl font-bold animate-bounce">ZIPLA!</p>
            </div>
          )}
          
          {showShakePrompt && (
            <div className="mt-6">
              <p className="text-purple-400 text-4xl font-bold animate-pulse">SALLA!</p>
            </div>
          )}
        </div>

        <div className="text-center text-gray-400 text-sm">
          Adım {step < 10 ? Math.floor(step) : 10}/10
        </div>
      </div>
    </div>
  );
};

export default DragonDungeonGame;
```

---

## 📄 Dosya 7: `.gitignore` (Kök klasörde)
```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*