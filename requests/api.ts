import axios, { AxiosError } from "axios";
import apiRoutes from "./routes";

const apiClient = axios.create({
  baseURL: "https://main.d1rc9ktckl9jbl.amplifyapp.com/", // Set your API base URL here
  headers: {
    "Content-Type": "application/json",
  },
});

const baseURL = `${process.env.MYWEBSITE}/api/`;

export const adminLogin = async (email: string, password: string) => {
  try {
    const response = await apiClient.post(
      `api/${apiRoutes.admin.login}`,
      { email, password }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message || "Login failed");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const hostSignup = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
  zipCode: string;
  city: string;
  country: string;
}) => {
  try {
    const response = await apiClient.post(
      `api/${apiRoutes.host.signup}`,
      data
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message || "Signup failed");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const getHostUrls = async (email: string) => {
  try {
    const response = await apiClient.get(
      `api/${apiRoutes.urls.getUrls}?email=${encodeURIComponent(email)}`
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message || "Failed to fetch URLs");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const generateHostUrls = async (email: string, quantity: number) => {
  try {
    const response = await apiClient.post(
      `api/${apiRoutes.urls.create}`,
      {
        hostEmail: email,
        quantity,
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message || "Failed to generate URLs");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const getHostInfo = async (email: string) => {
  try {
    const response = await apiClient.get(`api/${apiRoutes.host.get}`, {
      params: { email },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(
        error.response.data.message || "Failed to fetch host info"
      );
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const updateHostInfo = async (data: {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  zipCode: string;
  city: string;
  country: string;
}) => {
  try {
    const response = await apiClient.put(
      `api/${apiRoutes.host.update}`,
      data
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(
        error.response.data.message || "Failed to update host info"
      );
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
