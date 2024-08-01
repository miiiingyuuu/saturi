interface MiddlePartProps {
<<<<<<< HEAD
  middlePosition: any;
  mainPageIndicator: any;
  selectedRegion: any;
  style: any;
}

export default function MiddlePart({
  middlePosition,
  mainPageIndicator,
  selectedRegion,
  style,
}: MiddlePartProps) {
  return (
    <div
      className="middlepart"
=======
  middlePosition: number;
  mainPageIndicator: string;
  // selectedRegion?: string;
}

export default function MiddlePart({ middlePosition, mainPageIndicator }: MiddlePartProps) {
  return (
    <div 
      className="middlepart" 
>>>>>>> feat/FE/mainTmp
      style={{
        left: (() => {
          if (middlePosition === 0) {
            return "-110%";
<<<<<<< HEAD
          }
          if (middlePosition === 1) {
            return "0%";
          }
          if (middlePosition === 2) {
            return "110%";
          }
          return undefined;
        })(),
      }}
    >
      <h1
        className="blink"
        style={{
          position: "absolute",
          top: "75%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: 25,
        }}
      >
        {" "}
        {mainPageIndicator}{" "}
      </h1>
=======
          } if (middlePosition === 1) {
            return "0%";
          } if (middlePosition === 2) {
            return "110%";
          } return "0%";              
        })()
      }}>
      <h1 
        className="blink" 
        style={{
          position: 'absolute',
          top: '75%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 25,
        }}> {mainPageIndicator} </h1>
>>>>>>> feat/FE/mainTmp
    </div>
  );
}
