
import React, { useEffect, useState } from 'react';

interface TypewriterTextProps {
    phrases: string[];
    typingSpeed?: number;
    deletingSpeed?: number;
    delayAfterPhrase?: number;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
                                                           phrases,
                                                           typingSpeed = 100,
                                                           deletingSpeed = 50,
                                                           delayAfterPhrase = 1500,
                                                       }) => {
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const handleTyping = () => {
            const currentPhrase = phrases[currentPhraseIndex];

            // Handle pausing after complete phrase is typed
            if (!isDeleting && currentText === currentPhrase && !isPaused) {
                setIsPaused(true);
                setTimeout(() => {
                    setIsPaused(false);
                    setIsDeleting(true);
                }, delayAfterPhrase);
                return;
            }

            // Move to next phrase after deletion
            if (isDeleting && currentText === '' && !isPaused) {
                setIsDeleting(false);
                setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
                return;
            }

            // Calculate delay based on typing or deleting
            const delay = isDeleting ? deletingSpeed : typingSpeed;

            setTimeout(() => {
                setCurrentText(prevText => {
                    if (isDeleting) {
                        return prevText.substring(0, prevText.length - 1);
                    } else {
                        return currentPhrase.substring(0, prevText.length + 1);
                    }
                });
            }, delay);
        };

        handleTyping();
    }, [currentText, isDeleting, currentPhraseIndex, isPaused, phrases, typingSpeed, deletingSpeed, delayAfterPhrase]);

    return (
        <span className="text-gradient">
      {currentText}
            <span className="typing-indicator"></span>
    </span>
    );
};

export default TypewriterText;