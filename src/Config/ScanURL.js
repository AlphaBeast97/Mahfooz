import axios from "axios";

const BASE_URL = import.meta.env.VITE_VT_BASE_URL; // Should be 'https://www.virustotal.com/api/v3/urls'
const API_KEY = import.meta.env.VITE_VT_API_KEY;

let count = 0; 
const MAX_RETRIES = 10; // max retries
const POLLING_INTERVAL = 5000; // timeout asynchronous

export const RunURLScan = async (URL) => {
  try {
    const postData = new URLSearchParams();
    postData.append("url", URL);

    const response = await axios.post(BASE_URL, postData, {
      headers: {
        accept: "application/json",
        "x-apikey": API_KEY,
        "content-type": "application/x-www-form-urlencoded",
      },
    });
    if (response.status === 200 && response.data?.data?.id) {
      console.log("URL POST SUCCESS");
      const analysisId = response.data.data.id;
      const analysisLink = `https://www.virustotal.com/api/v3/analyses/${analysisId}`;
      return {
        success: true,
        data: response.data,
        analysisLink: analysisLink,
      }; // Return success indicator and data
    } else {
      console.error("VirusTotal Error Response:", response);
      return { success: false, error: response.data }; // Return failure indicator and error data
    }
  } catch (error) {
    console.error("Scan Error:", error);
    return { success: false, error: { message: error.message } }; // Return failure for network or other errors
  }
};

export const RunURLAnalysis = async (analysisLink) => {
  try {
    const response = await axios.get(analysisLink, {
      headers: {
        accept: "application/json",
        "x-apikey": API_KEY,
      },
    });

    if (response.status === 200 && response.data?.data?.attributes) {
      const analysisStatus = response.data.data.attributes.status;
      console.log("URL GET SUCCESS - Analysis Status:", analysisStatus);
      if (
        (analysisStatus === "queued" || analysisStatus === "pending") &&
        count < MAX_RETRIES
      ) {
        count++;
        console.log(
          `Analysis pending/queued. Retrying in ${
            POLLING_INTERVAL / 1000
          } seconds... (Attempt ${count}/${MAX_RETRIES})`
        );
        return new Promise((resolve) =>
          setTimeout(
            () => resolve(RunURLAnalysis(response.data?.data?.links?.self)),
            POLLING_INTERVAL
          )
        );
      } else if (analysisStatus === "completed") {
        count = 0;
        return { success: true, data: response.data };
      } else if (analysisStatus === "error") {
        console.error("Analysis failed on VirusTotal.");
        count = 0;
        return { success: false, error: "Analysis failed on VirusTotal." };
      } else {
        console.warn("Unknown analysis status:", analysisStatus);
        count = 0;
        return {
          success: false,
          error: `Unknown analysis status: ${analysisStatus}`,
        };
      }
    } else {
      console.error(
        "Error fetching analysis:",
        response?.status,
        response?.statusText
      );
      count = 0;
      return {
        success: false,
        error: `Error fetching analysis: ${response?.status} ${response?.statusText}`,
      };
    }
  } catch (error) {
    console.error("Analysis Error (Catch Block):", error);
    count = 0;
    return { success: false, error: { message: error.message } };
  }
};
