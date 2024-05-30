"use client";

import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, data } = useChat();
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === "user" ? "User: " : "AI: "}
          {m.role === "user" ? (
            <div>{m.content}</div>
          ) : (
            <Typewriter content={m.content} />
          )}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}

const Typewriter = ({ content }: { content: string }) => {
  const [displayedContent, setDisplayedContent] = useState("");

  const currentCharIndex = useRef(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentChar = content[currentCharIndex.current];
      setDisplayedContent((displayedContent) => displayedContent + currentChar);

      if (currentCharIndex.current === content.length - 1) {
        clearInterval(intervalId);
      }

      currentCharIndex.current++;
    }, 8); // Adjust the typing speed here (milliseconds)

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [content]); // Re-run effect whenever content prop changes

  return <div>{displayedContent}</div>;
};
