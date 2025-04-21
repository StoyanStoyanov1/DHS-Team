
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export default function CountUp({ end, duration = 2000, suffix = "", prefix = "" }: CountUpProps) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  useEffect(() => {
    if (!inView) return;
    
    let startTime: number;
    let animationFrame: number;
    
    const startAnimation = (timestamp: number) => {
      startTime = timestamp;
      animateCount(timestamp);
    };
    
    const animateCount = (timestamp: number) => {
      const runtime = timestamp - startTime;
      const relativeProgress = runtime / duration;
      
      if (relativeProgress < 1) {
        const currentCount = Math.floor(end * relativeProgress);
        setCount(currentCount);
        animationFrame = requestAnimationFrame(animateCount);
      } else {
        setCount(end);
        cancelAnimationFrame(animationFrame);
      }
    };
    
    animationFrame = requestAnimationFrame(startAnimation);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, inView]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}
