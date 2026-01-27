import axios from "axios";

// UBAH: Export variabel ini agar bisa dipakai di file lain
// Logic: Jika di Production (Vercel), pakai "/api". Jika tidak, pakai localhost.
export const API_URL = import.meta.env.PROD
  ? "/api"
  : "http://localhost:3000/api";

export const getRecommendations = async (criteria) => {
  try {
    const response = await axios.post(`${API_URL}/recommendations`, criteria);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
