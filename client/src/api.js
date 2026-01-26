import axios from "axios";

// PENYESUAIAN VERCEL:
// Gunakan relative path "/api" saat production agar mengikuti domain Vercel.
// Gunakan localhost:3000 hanya saat development.
const API_URL = import.meta.env.PROD ? "/api" : "http://localhost:3000/api";

export const getRecommendations = async (criteria) => {
  try {
    const response = await axios.post(`${API_URL}/recommendations`, criteria);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
