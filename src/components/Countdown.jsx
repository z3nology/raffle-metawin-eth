import { useEffect } from "react";
import { default as ReactCountdown } from "react-countdown";

const Countdown = ({ endDateTime }) => {
  const renderer = ({ days, hours, minutes, seconds }) => {
    return (
      <div className="text-sm font-extrabold text-black">
        <span>{days} D</span> :<span>{hours} H</span> :<span>{minutes} M</span>{" "}
        :<span>{seconds} S</span>
      </div>
    );
  };

  useEffect(() => {
    console.log("endDateTime", endDateTime);
  }, [endDateTime]);

  return (
    <ReactCountdown
      date={endDateTime * 1000}
      renderer={renderer}
      onComplete={() => console.log("complete")}
    />
  );
};

export default Countdown;
