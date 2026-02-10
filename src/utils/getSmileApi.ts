const username = import.meta.env.VITE_GET_SMILE_API_KEY;
const password = import.meta.env.VITE_GET_SMILE_API_SECRET;
const baseUrl = import.meta.env.VITE_GET_SMILE_API_HOST;

export const getListOfProviders = async () => {
  const encodedCredentials = btoa(`${username}:${password}`);

  try {
    const response = await fetch(
      "https://sandbox.smileapi.io/v1/providers?size=150",
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // This reads the stream and parses it into a JS object
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to getListOfProviders `, JSON.stringify(error));
    return {
      success: false,
      message: JSON.stringify(error),
    };
  }
};

export const initializeSmileLink = async () => {
  const host = import.meta.env.VITE_GET_SMILE_API_HOST;
  const apiKey = import.meta.env.VITE_GET_SMILE_API_KEY;
  const apiSecret = import.meta.env.VITE_GET_SMILE_API_SECRET;

  // Browser-native Base64 encoding
  const signature = btoa(`${apiKey}:${apiSecret}`);

  try {
    const response = await fetch(`${host}/users`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${signature}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}), // Empty object as per original code
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    // Structure the linkInitData based on your original logic
    const linkInitData = {
      token: result.data.token.accessToken,
      // Customizations for your Hackathon Demo
      topProviders: ["bir_orus_ph", "bdo", "accenture_ph"],
      providers: [], // Empty means show all
      enableUpload: false,
    };
    console.log(`link data: `, linkInitData);
    return linkInitData;
  } catch (error) {
    console.error("Failed to initialize Smile User:", error);
    return null;
  }
};

export const getIncome = async () => {
  const encodedCredentials = btoa(`${username}:${password}`);

  try {
    const response = await fetch("https://sandbox.smileapi.io/v1/incomes/", {
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // This reads the stream and parses it into a JS object
    const data = await response.json();
    console.log(`income: `, data);
    return data;
  } catch (error) {
    console.error(`Failed to getListOfProviders `, JSON.stringify(error));
    return {
      success: false,
      message: JSON.stringify(error),
    };
  }
};

export const getEmployments = async () => {
  const encodedCredentials = btoa(`${username}:${password}`);

  try {
    const response = await fetch("https://sandbox.smileapi.io/v1/employments", {
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // This reads the stream and parses it into a JS object
    const data = await response.json();
    console.log(`employments: `, data);
    return data;
  } catch (error) {
    console.error(`Failed to getListOfProviders `, JSON.stringify(error));
    return {
      success: false,
      message: JSON.stringify(error),
    };
  }
};
