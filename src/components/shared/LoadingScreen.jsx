import { useState, useEffect, useMemo } from 'react';
import './LoadingScreen.css';

const MESSAGES = ['Forging Helmet', 'Accessing Archive', 'Welcome User :)'];
const TYPE_SPEED = 100;
const ERASE_SPEED = 50;
const HOLD_TIME = 600;
const BAR_LENGTH = 20;

function LoadingScreen({ onComplete }) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [phase, setPhase] = useState('typing');
  const [progress, setProgress] = useState(0);

  // Total duration, calculated from message lengths so the bar finishes exactly when the text does
  const totalDuration = useMemo(() => {
    return MESSAGES.reduce((sum, msg, i) => {
      const isLast = i === MESSAGES.length - 1;
      const typeTime = msg.length * TYPE_SPEED;
      const eraseTime = isLast ? 0 : msg.length * ERASE_SPEED;
      return sum + typeTime + HOLD_TIME + eraseTime;
    }, 0);
  }, []);

  useEffect(() => {
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setProgress(Math.min(100, Math.round((elapsed / totalDuration) * 100)));
    }, 50);

    return () => clearInterval(progressInterval);
  }, [totalDuration]);

  useEffect(() => {
    const currentMessage = MESSAGES[messageIndex];
    const isLastMessage = messageIndex === MESSAGES.length - 1;

    if (phase === 'typing') {
      let charIndex = displayedText.length;

      const typeInterval = setInterval(() => {
        charIndex++;
        setDisplayedText(currentMessage.slice(0, charIndex));

        if (charIndex === currentMessage.length) {
          clearInterval(typeInterval);
          setPhase('holding');
        }
      }, TYPE_SPEED);

      return () => clearInterval(typeInterval);
    }

    if (phase === 'holding') {
      const holdTimeout = setTimeout(() => {
        if (isLastMessage) {
          setTimeout(onComplete, HOLD_TIME);
        } else {
          setPhase('erasing');
        }
      }, HOLD_TIME);

      return () => clearTimeout(holdTimeout);
    }

    if (phase === 'erasing') {
      let charIndex = currentMessage.length;

      const eraseInterval = setInterval(() => {
        charIndex--;
        setDisplayedText(currentMessage.slice(0, charIndex));

        if (charIndex === 0) {
          clearInterval(eraseInterval);
          setMessageIndex((i) => i + 1);
          setPhase('typing');
        }
      }, ERASE_SPEED);

      return () => clearInterval(eraseInterval);
    }
  }, [phase, messageIndex, onComplete]);

  const filledBars = Math.round((progress / 100) * BAR_LENGTH);
  const bar = '█'.repeat(filledBars) + '░'.repeat(BAR_LENGTH - filledBars);

  return (
    <div className="loading-screen">
      <div className="loading-screen__text">
        {displayedText}
        <span className="loading-screen__cursor">_</span>
      </div>
      <div className="loading-screen__bar">
        [{bar}] {progress}%
      </div>
    </div>
  );
}

export default LoadingScreen;