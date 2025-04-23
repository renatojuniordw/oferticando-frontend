import React from 'react';

interface LogoSVGProps {
  width?: number;
  height?: number;
}

const LogoSVG: React.FC<LogoSVGProps> = ({ width, height }) => {
  const styles = {
    cls1: {
      fontFamily: 'Avenir-Black, Avenir',
      fontWeight: 800,
    },
    cls2: {
      fontFamily: 'Avenir-Black, Avenir',
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    cls3: {
      fontFamily: 'Avenir-Light, Avenir',
      fontWeight: 300,
    },
    cls4: {
      fill: '#4e342e',
      fontSize: '60px',
    },
    cls5: {
      fill: '#ed6f1d',
    },
  };

  return (
    <svg
      id="LOGOS"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 570.52 112.13"
      width={width}
      height={height}
    >
      <g>
        <path
          style={styles.cls5}
          d="M92.25,97.54h-53.11c-2.93,0-5.7-1.16-7.59-3.19-1.67-1.79-2.5-4.06-2.33-6.41l3.64-52.37c.11-1.62,1.46-2.87,3.08-2.87h59.5c1.62,0,2.97,1.26,3.08,2.87l3.64,52.37c.16,2.35-.66,4.62-2.33,6.41-1.89,2.03-4.66,3.19-7.59,3.19ZM38.82,38.87l-3.44,49.49c-.06.8.34,1.4.69,1.77.73.78,1.85,1.23,3.07,1.23h53.11c1.23,0,2.34-.45,3.07-1.23.34-.37.74-.97.69-1.77l-3.44-49.49h-53.74Z"
        />
        <path d="M82.51,32.98h-6.18c0-5.87-4.77-10.64-10.64-10.64s-10.64,4.77-10.64,10.64h-6.18c0-9.27,7.54-16.81,16.81-16.81s16.81,7.54,16.81,16.81Z" />
      </g>
      <text style={styles.cls4} transform="translate(110.93 91.36)">
        <tspan style={styles.cls1} x="0" y="0">
          OFE
        </tspan>
        <tspan style={styles.cls2} x="123.3" y="0">
          R
        </tspan>
        <tspan style={styles.cls1} x="161.1" y="0">
          T
        </tspan>
        <tspan style={styles.cls3} x="195.54" y="0">
          ICANDO
        </tspan>
      </text>
    </svg>
  );
};

export default LogoSVG;
