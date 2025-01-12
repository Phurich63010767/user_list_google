import axios from 'axios';

const API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

export const fetchSheetData = async (spreadsheetId, range, token) => {
  const url = `${API_BASE}/${spreadsheetId}/values/${range}`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
