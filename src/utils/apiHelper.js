import BASE_URL from "../api/api";
import { getAuthHeader } from "./auth";

// 🔥 CORE SAFE FETCH
const safeFetch = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      console.error("API Error:", res.status);
      return null;
    }

    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch (err) {
    console.error("Fetch Error:", err);
    return null;
  }
};

// 🔹 GET
export const apiGet = async (path) => {
  return safeFetch(`${BASE_URL}${path}`, {
    headers: getAuthHeader(),
  });
};

// 🔹 POST
export const apiPost = async (path, body) => {
  return safeFetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(body),
  });
};

// 🔹 PUT
export const apiPut = async (path, body) => {
  return safeFetch(`${BASE_URL}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(body),
  });
};

// 🔹 DELETE
export const apiDelete = async (path) => {
  return safeFetch(`${BASE_URL}${path}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
};
