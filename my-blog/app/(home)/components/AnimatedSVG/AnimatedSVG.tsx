"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./AnimatedSVG.module.scss";

export default function AnimatedSVG() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    // Get all paths
    if (svgRef.current) {
      const paths = svgRef.current.querySelectorAll("path");
      
      // Set initial styles and get path lengths
      paths.forEach((path, index) => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;
        path.style.fill = "transparent";
        path.style.stroke = "#66d9ef";
        path.style.strokeWidth = "1";
        path.style.strokeMiterlimit = "10";
        
        // Animate each path with delay
        setTimeout(() => {
          path.style.transition = "stroke-dashoffset 2s ease-in-out, fill 1.5s ease";
          path.style.strokeDashoffset = "0";
        }, index * 200);
      });

      // After animation completes, add the completed class
      setTimeout(() => {
        paths.forEach(path => {
          path.style.fill = "#000";
        });
        setIsAnimationComplete(true);
      }, 2000 + paths.length * 200);
    }
  }, []);

  // Mouse movement effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (svgRef.current) {
        const x = e.clientX;
        const y = e.clientY;
        
        const posX = -(x / window.innerWidth - 0.5) * 20;
        const posY = -(y / window.innerHeight - 0.5) * 20;
        
        // Remove transition to make movement immediate
        svgRef.current.style.transition = "none";
        svgRef.current.style.transform = `translate(${posX}px, ${posY}px)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className={styles.container}>
      <svg
        ref={svgRef}
        className={`${styles.svg} ${isAnimationComplete ? styles.complete : ""}`}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 499 499"
      >
        <path
          ref={el => { pathRefs.current[0] = el; }}
          id="path-3"
          d="M319.31,380.89c3.35-1.65,5.73-2.66,8-3.95,43.55-25.26,69.74-63.26,82-111.53,1.64-6.44,3.61-12.81,5.77-19.09a4.69,4.69,0,0,1,3.81-2.34c9.23,1.27,18.4,3,27.62,4.36,4.8.71,6.36,2.78,5.42,7.76-9.12,48.33-30.94,89.77-66.59,123.79-28.6,27.3-62.18,45.54-100.49,55.17-8,2-10,.52-10-7.69q.21-114,.46-228,.27-91.72.82-183.45c0-1.17,0-2.34,0-3.5C276.54,1.22,278.63-.09,289.31,3c32.13,9.3,61.4,24,86.82,45.85,41.95,36.08,67.24,81.6,76.44,136.11,1.29,7.66.95,8.17-6.7,9.42-8.54,1.39-17.11,2.62-25.68,3.84-4.87.69-6.35-2.48-7.1-6.47-4.6-24.31-13-47.19-26.11-68.24-13.82-22.21-31.31-41-53.1-55.59-3.56-2.39-7-4.92-11.6-8.12-.34,4.32-.85,7.83-.87,11.33-.33,49.33-.53,98.66-.89,148-.32,43.66-.82,87.32-1.2,131C319.23,359.9,319.31,369.69,319.31,380.89Z"
        />
        <path
          ref={el => { pathRefs.current[1] = el; }}
          id="path-1"
          d="M141.82,385.11c0-7.13,0-13.57,0-20q.18-58.5.37-117c0-11-1.74-12.79-12.75-12.86q-27.5-.18-55-.23c-6.48,0-7.68-1-7.47-7.57.28-8.59,1-17.18,1.56-25.77.17-2.68,1.65-3.57,4.3-3.55q53.74.36,107.49.54c4.85,0,4.74,3.07,4.76,6.36.18,30.67.58,61.33.5,92-.1,44.34-.54,88.67-.85,133,0,6.7-.33,7.52-7.07,6.82a105.11,105.11,0,0,1-21.42-4.45C120,420.64,87.93,401.76,61.55,373.93c-34.76-36.67-56.32-80-60.36-130.41C-5.71,157.37,27.26,88.6,96,36.75c10.54-7.95,10.77-7.67,18.15,2.86,3.63,5.19,7,10.6,10.85,15.59,3.2,4.12,2.28,6.36-1.6,9.64C111,75.35,98.17,85.64,87,97.45c-19.65,20.81-32.63,45.66-40.14,73.35-4.79,17.66-7.34,35.63-6.15,53.86,4.19,64.55,30.83,116.75,85.49,153.19A124.85,124.85,0,0,0,138,384.32C138.85,384.75,139.91,384.73,141.82,385.11Z"
        />
        <path
          ref={el => { pathRefs.current[2] = el; }}
          id="path-2"
          d="M250.66,434.18c0,5.11-2.95,7.32-8.07,7.4-9.65.14-19.3.51-29,.71-3.49.07-5.11-2-5.37-5.31-.12-1.66-.1-3.33-.09-5q.54-109.22,1.07-218.45c.08-16.65.05-33.3,0-49.95,0-8.79-1.75-10.43-10.59-10.42q-26.25.06-52.5.11c-6.93,0-8.29-1.18-8.13-8.17.88-39.63,1.93-79.27,2.8-118.9.36-16.08.48-16.5,15.86-21.09,5.74-1.71,11.51-3.38,17.36-4.67s7.58.2,7.54,6.28q-.32,49-.73,98c-.06,8.12.08,8.28,8.42,8.31,18.33.07,36.66.23,55,0,5.06-.06,6.45,1.64,6.43,6.62C250.55,172.14,250.5,381.86,250.66,434.18Z"
        />
      </svg>
    </div>
  );
}