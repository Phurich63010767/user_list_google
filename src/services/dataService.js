import axios from "axios";
import { gapi } from "gapi-script";

const CLIENT_ID = "244324809-c6qb4dd3trb7emrrkjla1uhq7fodru54.apps.googleusercontent.com";
const API_KEY = "AIzaSyCRnioBQRAtD0h2_OpECpvhOhycDSBMn2w";
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

const INITIAL_DATA_API = "https://api.sheetbest.com/sheets/aa3fc8bb-7fdd-4114-b156-8ef8307f549b";

export const initGoogleApi = () => {
  gapi.load("client:auth2", () => {
    gapi.client
      .init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPES,
      })
      .then(() => console.log("Google API initialized"));
  });
};

export const fetchData = async () => {
  try {
    const res = await axios.get(INITIAL_DATA_API);
    return res.data.map((entry) => ({
      key: entry.id,
      id: entry.id,
      first_name: entry.first_name,
      last_name: entry.last_name,
      email: entry.email,
      gender: entry.gender,
      city: entry.city,
      country: entry.country,
      country_code: entry.country_code,
      state: entry.state,
      street_address: entry.street_address,
      job_title: entry.job_title,
      company_name: entry.company_name,
      photo: entry.photo,
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const exportToGoogleSheets = async (data, fileName) => {
  const accessToken = gapi.auth.getToken().access_token;

  const values = [
    [
      "ID",
      "First Name",
      "Last Name",
      "Email",
      "Gender",
      "City",
      "Country",
      "Country Code",
      "State",
      "Street Address",
      "Job Title",
      "Company Name",
      "Photo",
    ],
    ...data.map((entry) => [
      entry.id,
      entry.first_name,
      entry.last_name,
      entry.email,
      entry.gender,
      entry.city,
      entry.country,
      entry.country_code,
      entry.state,
      entry.street_address,
      entry.job_title,
      entry.company_name,
      entry.photo,
    ]),
  ];

  try {
    const response = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
      method: "POST",
      headers: new Headers({
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        properties: {
          title: fileName,
        },
      }),
    });
    const spreadsheet = await response.json();
    const spreadsheetId = spreadsheet.spreadsheetId;
    const sheetName = spreadsheet.sheets[0].properties.title;

    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A1:append?valueInputOption=USER_ENTERED`,
      {
        method: "POST",
        headers: new Headers({
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          range: `${sheetName}!A1`,
          majorDimension: "ROWS",
          values: values,
        }),
      }
    );
    return spreadsheet.spreadsheetUrl;
  } catch (error) {
    console.error("Error exporting data:", error);
    throw error;
  }
};
