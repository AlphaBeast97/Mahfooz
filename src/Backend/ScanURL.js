import axios from "axios";

const BASE_URL = import.meta.env.VITE_VT_BASE_URL; // Should be 'https://www.virustotal.com/api/v3/urls'
const API_KEY = import.meta.env.VITE_VT_API_KEY;

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
    if (
      response.status === 200 &&
      response.data &&
      response.data.data &&
      response.data.data.id
    ) {
      console.log("URL POST SUCCESS");
      const analysisId = response.data.data.id;
      const analysisLink = `https://www.virustotal.com/api/v3/analyses/${analysisId}`;
      console.log("Analysis ID:", analysisId);
      console.log("Constructed Analysis Link:", analysisLink);
      return {
        success: true,
        data: response.data,
        analysisLink: analysisLink,
        analysisId: analysisId,
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
    console.log(response)
    if (
      response.status === 200 &&
      response.data &&
      response.data.data &&
      response.data.data.attributes
    ) {
      console.log("URL GET SUCCESS");
      return {
        success: true,
        data: response.data,
      };
    } else {
      console.error("VirusTotal Analysis Error Response :", response);
      return { success: false, error: response.data }; // Return failure indicator and error data
    }
  } catch (error) {
    console.error("Analysis Error", error)
    return { success: false, error: { message: error.message } }; // Return failure for network or other errors
  }
}
