import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, Button, message } from 'antd';
import axios from 'axios';
import { gapi } from 'gapi-script';

const UserTable = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const sheetURL = 'https://api.sheetbest.com/sheets/aa3fc8bb-7fdd-4114-b156-8ef8307f549b';

  const CLIENT_ID = '244324809-c6qb4dd3trb7emrrkjla1uhq7fodru54.apps.googleusercontent.com';
  const API_KEY = 'AIzaSyCRnioBQRAtD0h2_OpECpvhOhycDSBMn2w';
  const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

  // Initialize Google API Client
  useEffect(() => {
    const initGapi = () => {
      gapi.load('client:auth2', () => {
        gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          scope: SCOPES,
        }).then(()=> console.log(gapi));
      });
    };
    initGapi();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      axios
        .get(sheetURL)
        .then((res) => {
          const transformedData = res.data.map((entry) => ({
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
          setData(transformedData);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }
  }, [isLoggedIn]);

  // const exportToGoogleSheet = async () => {
  //   try {
  //     // Authenticate with Google API
  //     // await gapi.auth2.getAuthInstance().signIn();

  //     // Create a new Google Sheet
  //     const response = await gapi.client.sheets.spreadsheets.create({
  //       properties: {
  //         title: 'Exported User Data',
  //       },
  //     }).then(()=> console.log("Created sheet"));

  //     const spreadsheetId = response.result.spreadsheetId;

  //     // Prepare data for export
  //     const headers = [
  //       ['ID', 'First Name', 'Last Name', 'Email', 'Gender', 'City', 'Country', 'Country Code', 'State', 'Street Address', 'Job Title', 'Company Name'],
  //     ];
  //     const rows = data.map((item) => [
  //       item.id,
  //       item.first_name,
  //       item.last_name,
  //       item.email,
  //       item.gender,
  //       item.city,
  //       item.country,
  //       item.country_code,
  //       item.state,
  //       item.street_address,
  //       item.job_title,
  //       item.company_name,
  //     ]);

  //     const values = [...headers, ...rows];

  //     // Append data to the new sheet
  //     await gapi.client.sheets.spreadsheets.values.update({
  //       spreadsheetId,
  //       range: 'Sheet1',
  //       valueInputOption: 'RAW',
  //       resource: { values },
  //     });

  //     // Display success message and sheet link
  //     message.success('Data exported successfully!');
  //     window.open(`https://docs.google.com/spreadsheets/d/${spreadsheetId}`, '_blank');
  //   } catch (error) {
  //     console.error('Error exporting data:', error);
  //     message.error('Failed to export data.');
  //   }
  // };

  function exportToGoogleSheet() {
    const accessToken = gapi.auth.getToken().access_token;
    const fileName = "User Data"; // ชื่อ Spreadsheet และ Sheet
    const sheetName = "User Data"; // ชื่อ Sheet ภายใน Spreadsheet
  
    // ข้อมูลจาก Table ที่ต้องการเพิ่มลงใน Sheet
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
      ], // Header
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
        entry.photo, // URL หรือข้อมูลเกี่ยวกับรูป
      ]),
    ];
  
    // สร้าง Spreadsheet ใหม่
    fetch("https://sheets.googleapis.com/v4/spreadsheets", {
      method: "POST",
      headers: new Headers({
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        properties: {
          title: fileName, // ตั้งชื่อไฟล์
        },
      }),
    })
      .then((res) => res.json())
      .then((spreadsheet) => {
        console.log("Spreadsheet created:", spreadsheet);
  
        const spreadsheetId = spreadsheet.spreadsheetId;
  
        // เพิ่ม Sheet ใหม่พร้อมชื่อที่ระบุ
        return fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
          {
            method: "POST",
            headers: new Headers({
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            }),
            body: JSON.stringify({
              requests: [
                {
                  addSheet: {
                    properties: {
                      title: sheetName,
                    },
                  },
                },
              ],
            }),
          }
        )
          .then(() => {
            // เพิ่มข้อมูลลงใน Sheet
            return fetch(
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
          })
          .then((res) => res.json())
          .then((response) => {
            console.log("Data added to sheet:", response);
            window.open(spreadsheet.spreadsheetUrl); // เปิด Spreadsheet ที่สร้าง
          });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }  

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'First Name', dataIndex: 'first_name', key: 'first_name' },
    { title: 'Last Name', dataIndex: 'last_name', key: 'last_name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Gender', dataIndex: 'gender', key: 'gender' },
    { title: 'City', dataIndex: 'city', key: 'city' },
    { title: 'Country', dataIndex: 'country', key: 'country' },
    { title: 'Country Code', dataIndex: 'country_code', key: 'country_code' },
    { title: 'State', dataIndex: 'state', key: 'state' },
    { title: 'Street Address', dataIndex: 'street_address', key: 'street_address' },
    { title: 'Job Title', dataIndex: 'job_title', key: 'job_title' },
    { title: 'Company Name', dataIndex: 'company_name', key: 'company_name' },
    {
      title: 'Photo',
      dataIndex: 'photo',
      key: 'photo',
      render: (photo) => (
        <img src={photo} alt="profile" style={{ width: '50px', borderRadius: '50%' }} />
      ),
    },
  ];

  if (isLoggedIn) {
    return (
      <div>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button type="primary" onClick={exportToGoogleSheet}>
            Export to Google Sheet
          </Button>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default UserTable;
