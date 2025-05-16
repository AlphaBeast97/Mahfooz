import React, { useState } from "react";
import { RunURLAnalysis, RunURLScan } from "./Backend/ScanURL";
import toast from "react-hot-toast";
import { BounceLoader } from "react-spinners";

const App = () => {
  const [URL, setURL] = useState("");
  const [ScanResult, setScanResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setURL(e.target.value);
  };
  const handleKeyPress = (e) => {
    e.key === "Enter" && handleSubmit();
  };

  const handleSubmit = async () => {
    if (URL === "") {
      toast.error("URL Required", {
        id: "submit-url",
      });
      return;
    }
    setIsLoading(true);
    const Response = await RunURLScan(URL);
    if (Response && Response.success && Response.analysisLink) {
      setScanResult(Response.data);
      toast.success("Starting Analysis");
      try {
        const Result = await RunURLAnalysis(Response.analysisLink);
        if (Result?.success) {
          setScanResult(Result.data); // Update state with full analysis
          toast.success("Analysis Complete!");
        } else {
          toast.error(
            `Analysis failed: ${Result?.error || "Something went wrong"}`,
            { id: "analysis-error" }
          );
          console.error("Final Analysis Failed:", Result);
        }

        // Optionally, you might want to update the UI or show another toast
        // when the analysis results are successfully retrieved and processed.
      } catch (error) {
        console.error("Error during RunURLAnalysis:", error);
        toast.error(
          `Error fetching analysis results: ${
            error.message || "Something went wrong"
          }`,
          {
            id: "analysis-error",
          }
        );
        // Optionally, update the scanResult state to indicate an error
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Request Failed", Response);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl text-center py-5">Mahfooz</h1>
      <div className="mb-4">
        <p className="mb-2">Enter URL to Scan:</p>
        <input
          className="border rounded py-2 px-3 w-full"
          type="url"
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          placeholder="https://example.com"
          required
        />
      </div>
      {!isLoading ? (
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Run Scan
        </button>
      ) : (
        <BounceLoader />
      )}
    </div>
  );
};

export default App;
