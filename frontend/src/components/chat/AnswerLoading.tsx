import { animated, useSpring } from "@react-spring/web";
import "./chat.css";

export const AnswerLoading = () => {
  const animatedStyles = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
  });

  return (
    <animated.div style={{ ...animatedStyles }}>
      {/* <AnswerIcon /> */}
      <p className="answerText">
        Generating answer
        <span className="loadingdots" />
      </p>
    </animated.div>
  );
};
