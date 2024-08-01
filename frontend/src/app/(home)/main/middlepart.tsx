interface MiddlePartProps {
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
      style={{
        left: (() => {
          if (middlePosition === 0) {
            return "-110%";
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
    </div>
  );
}
