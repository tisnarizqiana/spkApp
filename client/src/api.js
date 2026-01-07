import axios from "axios";

// Pastikan port ini sama dengan port Backend server Anda (3000)
const API_URL = "http://localhost:3000/api";

export const getRecommendations = async (criteria) => {
  try {
    const response = await axios.post(`${API_URL}/recommendations`, criteria);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
