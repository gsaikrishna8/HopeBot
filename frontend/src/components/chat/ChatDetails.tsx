import * as React from "react";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import HelpIcon from "@mui/icons-material/Help";
import SendIcon from "@mui/icons-material/Send";
import { AnswerLoading } from "./AnswerLoading";
import { Typography } from "@mui/material";
function ChatDetails() {
  const [question, setQuestion] = React.useState("");
  const [answers, setAnswers] = React.useState<
    { question: string; response: string }[]
  >([]);
  const [help, setHelp] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const lastQuestionRef = React.useRef<string>("");
  const chatMessageStreamEnd = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(
    () => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth" }),
    [isLoading]
  );
  React.useEffect(
    () => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "auto" }),
    [answers]
  );
 

  const delay = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));
  const handleChatApiRequest = async (question: string): Promise<void> => {
    if (!question.trim()) return;
    lastQuestionRef.current = question;
    setIsLoading(true);
    try {
      await delay(2000);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (response.status === 429) {
        console.warn("Rate limit hit, retrying after 5 seconds");
        setError(true);
        setErrorMessage("Rate limit has been reached, Please try agian later");
        await delay(1000);
        return handleChatApiRequest(question);
      }
      const result = await response.json();
      console.log("result......", result);
      setAnswers((prev) => [...prev, { question, response: result.response }]);
    } catch (error) {
      setError(true);
      console.log("API error:", error);
  if (error instanceof Error) {
    setErrorMessage(error.message);
  } else if (typeof error === "object" && error !== null && "error" in error) {
    setErrorMessage((error as any).error);
  } else {
    setErrorMessage("An unknown error occurred");
  }
    } finally {
      setIsLoading(false);
    }
  };
  const sendMessage = () => {
    if (isLoading || !question.trim()) {
      return;
    }
    handleChatApiRequest(question);
    setQuestion("");
  };
  const onEnter = (ev: React.KeyboardEvent<Element>) => {
    if (ev.key === "Enter" && !ev.shiftKey) {
      sendMessage();
      ev.preventDefault();
    }
  };
  const handleInputChange = (
    ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = ev.target.value;
    if (!newValue) {
      setQuestion("");
    } else if (question.length <= 1000) {
      setQuestion(newValue);
    }
  };
  const handleClear = () => {
    // setQuestion("");
    setAnswers([]);
    lastQuestionRef.current = "";
    setHelp(false);
  };
  console.log("answers", answers);
  const handleHelp = () => {
    setHelp(true);
    // !lastQuestionRef.current;
    setAnswers([]);
  };
  console.log("eror", errorMessage)
  return (
    <div className="chatContainer">
      {!error && !help && !lastQuestionRef.current ? (
        <div>
          <div className="responseContainer">
            <div className="response">
              {" "}
              Hello! I'm here to help you with mental wellness and motivation.
              How can I assist you today?{" "}
            </div>
          </div>
          {/* {question && (
            <div className="questionContainer">
              <div className="message">{question}</div>
            </div>
          )} */}
        </div>
      ) : (
        <div className="chatMessageStream">
          {answers.map((chat, i) => (
            <div key={i}>
              <div className="questionContainer">
                <div className="message">{chat.question}</div>
              </div>
              <div className="responseContainer">
                <div className="response">{chat.response}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <>
              <div className="questionContainer">
                <div className="message">{lastQuestionRef.current}</div>
              </div>
              <div className="messageLoading">
                <AnswerLoading />
              </div>
            </>
          )}
          {help && (
            <>
              <div className="helpContainer">
                <div style={{ textAlign: "center" }}>
                  <Typography style={{ textAlign: "center", color:"black" }}>
                    Please refer this document
                  </Typography>

                  <a
                    href="https://platform.openai.com/docs/api-reference/introduction"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    OpenAI API Documentation
                  </a>
                </div>
              </div>
            </>
          )}
          {error ? (
            <div className="helpContainer">
              <div style={{ textAlign: "center",color:"black" }}>
                <Typography style={{ textAlign: "center" }}>
                  {errorMessage}
                </Typography>
              </div>
            </div>
          ) : null}
          <div ref={chatMessageStreamEnd} />
        </div>
      )}

      <div className="chatIconButton">
        <div>
          <ClearAllIcon
            style={{
              padding: "10px",
              color: "#00B0FF",
              cursor: "pointer",
              fontSize: "27px",
            }}
            onClick={handleClear}
          />
        </div>
        <div>
          <a
            href="https://api.whatsapp.com/send?phone=8886163899&text=Hi"
            target="_blank"
          >
            <WhatsAppIcon
              style={{
                padding: "10px",
                color: "green",
                cursor: "pointer",
                fontSize: "27px",
              }}
            />
          </a>
        </div>
        <div>
          <HelpIcon
            style={{
              padding: "10px",
              color: "#00B0FF",
              cursor: "pointer",
              fontSize: "27px",
            }}
            onClick={handleHelp}
          />
        </div>
      </div>
      <div className="inputContainer">
        <div className="inputField">
          <input
            type="text"
            value={question}
            onKeyDown={onEnter}
            className="questionInput"
            onChange={handleInputChange}
          />
          <SendIcon className="sendButton" onClick={sendMessage} />
        </div>
      </div>
    </div>
  );
}

export default ChatDetails;
