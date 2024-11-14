import { Alert } from "react-native";
import axios from "./axios";

export const registerUser = async (data) => {
  try {
    const response = await axios.post('register',data, 
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

export const loginUser = async (data) => {
  try {
    const response = await axios.post('login',data, 
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

export const verifyOtp = async (data) => {
  try {
    const response = await axios.post('verify-mfa',data, 
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

export const getDoc = async (username) => {
    try {
      const response = await axios.get(`user-documents/${username}`);
      return response.data; // Return the data directly
    } catch (error) {
      console.error("Error fetching contact data:", error); // Log the error for debugging
      return false;
    }
  };
 
  export const loadGraph = async (data) => {
    try {
      console.log("??????",data);
      const response = await axios.post('load-knowledge-graph',data
    );
      if(response) return response.data;
      else return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

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
