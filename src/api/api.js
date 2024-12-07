import { Alert } from "react-native";
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
    // Create a new FormData instance
    const formData = new FormData();
    // Append data to the FormData instance
    formData.append('text', data.text);
    if (data.image) {
      formData.append('image', {
        uri: data.image.uri,
        type: data.image.type,
        name: data.image.name,
      });
    }
    // Send the request with FormData
    const response = await axios.post('chatbot', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
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
export const getDoc = async (username) => {
    try {
      const response = await axios.get(`user-documents/${username}`);
      return response.data; // Return the data directly
    } catch (error) {
      console.error("Error fetching contact data:", error); // Log the error for debugging
      return false;
    }
  };
 

  export const getQuery = async (data) => {
    try {
      console.log("??????",data);
      const response = await axios.post('query-knowledge-graph',data
    );
      if(response) return response.data;
      else return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

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
