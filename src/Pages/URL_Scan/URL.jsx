import React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { RunURLAnalysis, RunURLScan } from "../../Config/ScanURL";
import NavBar from "./Components/NavBar";
import { EarthLock } from "lucide-react";
import ResultCard from "./Components/ResultCard";
import { BounceLoader } from "react-spinners";

const URL = () => {
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
        if (Result.success) {
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
        console.log(ScanResult);
      }
    } else {
      toast.error("Request Failed", Response);
      setIsLoading(false);
    }
  };

  return (
    <main className=" min-h-screen px-3 bg-[#160C28] text-purple-100">
      <NavBar />
      <div className="p-6 flex justify-center items-center flex-col mx-auto max-w-[750px]">
        <div className="mb-4 w-full">
          <EarthLock className="w-full h-30 p-4" />
          <p className="mb-2">Enter URL to Scan:</p>
          <input
            className="border rounded py-2 px-3 w-full focus:border-b-amber-400"
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
          <BounceLoader color="#a855f7" />
        )}
      </div>
      <div className="max-w-[750px] mx-auto text-center px-2 py-5 ">
        <h2 className="font-bold">Scan Results</h2>
        {ScanResult?.data?.attributes?.results && (
          <div className="grid gap-5 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-1">
            {Object.entries(ScanResult.data.attributes.results).map(
              ([engine, result]) => (
                <ResultCard key={engine} engine={engine} result={result} />
              )
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default URL;
