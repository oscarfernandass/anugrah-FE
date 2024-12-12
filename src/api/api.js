import { Alert } from "react-native";
import RNFS from 'react-native-fs';
import axios, { AxiosInstance } from 'axios';

const BASE_URL = 'https://roughy-included-partially.ngrok-free.app/';

export const translateText = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}text-translate`, data,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    if (response) return response.data;
    else return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const chatBotApi = async (data) => {
  try {
    // Send the request with FormData
    console.log("form data???", JSON.stringify(data))
    const response = await axios.post(`${BASE_URL}chatbot`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response) return response.data;
    else return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};


export const verifyOtp = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}auth`, data,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    if (response) return response.data;
    else return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const audioToTextApi = async (data) => {
  try {
    console.log("??????", data);
    const response = await axios.post(`${BASE_URL}audio-to-text-base64`, data
    );
    if (response) return response.data;
    else return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const VideoToSign = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}youtube-video2-sign`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response){
      console.log(response);
      return response.data;
    } 
    else return false;
  } catch (error) {
    console.log('Error:', error.message);
    return false;
  }
};

export const VideoToDes = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}youtube-description`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response){
      console.log(response);
      return response.data;
    } 
    else return false;
  } catch (error) {
    console.log('Error:', error.message);
    return false;
  }
};
export const VideoToSumm = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}youtube-summarize`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response){
      console.log(response);
      return response.data;
    } 
    else return false;
  } catch (error) {
    console.log('Error:', error.message);
    return false;
  }
};


export const postBlock = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}secure-chat`, data,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    if (response) return response.data;
    else return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const TextToVoice = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}emotion-audio`, data,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    if (response) return response.data;
    else return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}



const customURL = 'https://surely-allowing-skylark.ngrok-free.app/'

export const groupAudio = async (data) => {
  try {
    const response = await axios.post(`${customURL}`, data); // Use the full URL for this request
    if (response) return response.data;
    else return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};












export const getDoc = async (username) => {
  try {
    const response = await axios.get(`user-documents/${username}`);
    return response.data; // Return the data directly
  } catch (error) {
    console.error("Error fetching contact data:", error); // Log the error for debugging
    return false;
  }
};



export const getAnalytics = async () => {
  try {
    const response = await axios.get('get-all');
    return response.data;
  } catch (error) {
    console.error("Error fetching contact data:", error);
    return false;
  }
};

export const getMagnus = async (data) => {
  try {
    console.log("??????", data);
    const response = await axios.post('summary-knowledge-graph', data
    );
    if (response) return response.data;
    else return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const postFeed = async (data) => {
  try {
    const response = await axios.post('submit-feedback', data
    );
    if (response) return response.data;
    else return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}
