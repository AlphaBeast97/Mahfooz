import React from 'react'

const ResultCard = ({ engine, result }) => {
  return (
    <div className="rounded-lg flex bg-blue-950 flex-col gap-2 px-2 py-4 transition-all hover:scale-105">
      <p className="font-bold">{engine}</p>
      {result.result && (
        <p
          className={`${result.result === "unrated" && "text-gray-400"} ${
            result.result === "clean" && "text-green-400"
          } ${(result.result === "malware"| result.result === "malicious") && "text-red-400"}`}
        >
          Result: {result.result}
        </p>
      )}
    </div>
  );
};

export default ResultCard