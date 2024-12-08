import { Alert } from "react-native";
import RNFS from 'react-native-fs';
import axios from "./axios";

export const translateText = async (data) => {
  try {
    const response = await axios.post('text-translate',data, 
  {
      headers: {
        'Content-Type': 'application/json',
      }
    }
  );
    if(response) return response.data;
    else return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const chatBotApi = async (data) => {
  try {
    // Send the request with FormData
    console.log("form data???",JSON.stringify(data))
    const response = await axios.post('chatbot', data, {
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
    const response = await axios.post('auth',data, 
    {
      headers: {
        'Content-Type': 'application/json',
      }
    }
  );
    if(response) return response.data;
    else return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const audioToTextApi = async (data) => {
  try {
    console.log("??????",data);
    const response = await axios.post('audio-to-text-base64',data
  );
    if(response) return response.data;
    else return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const linkToDes = async (data) => {
  try {
    const response = await axios.post('youtube-video2-sign', data, {
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'blob', // Receive binary data
    });

    if (response) {
      console.log("hi");
      
      // Convert Blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(response.data);

      const base64 = await new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result.split(',')[1]); // Extract base64 string
        reader.onerror = reject;
      });

      // Define the file path
      const filePath = `${RNFS.DocumentDirectoryPath}/downloaded_file`;

      // Write the file to local storage
      await RNFS.writeFile(filePath, base64, 'base64');

      console.log('File saved at:', filePath);
      return filePath; // Return the file path
    } else {
      console.log('No response data received.');
      return false;
    }
  } catch (error) {
    console.log('Error:', error.message);
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
    console.log("??????",data);
    const response = await axios.post('summary-knowledge-graph',data
  );
    if(response) return response.data;
    else return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const postFeed = async (data) => {
  try {
    const response = await axios.post('submit-feedback',data
  );
    if(response) return response.data;
    else return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}
