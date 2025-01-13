import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Button, Form , Modal, Input, message } from "antd";
import axios from "axios";
import { gapi } from "gapi-script";

const UserTable = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [addingData, setAddingData] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isSheetCreated, setIsSheetCreated] = useState(false);
  const [sheetUrl, setSheetUrl] = useState("");

  const [form] = Form.useForm();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const CLIENT_ID =
    "244324809-c6qb4dd3trb7emrrkjla1uhq7fodru54.apps.googleusercontent.com";
  const API_KEY = "AIzaSyCRnioBQRAtD0h2_OpECpvhOhycDSBMn2w";
  const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

  // Initialize Google API Client
  useEffect(() => {
    const initGapi = () => {
      gapi.load("client:auth2", () => {
        gapi.client
          .init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            scope: SCOPES,
          })
          .then(() => console.log(gapi));
      });
    };
    initGapi();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      axios
        .get("https://api.sheetbest.com/sheets/aa3fc8bb-7fdd-4114-b156-8ef8307f549b")
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
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    }
  }, [isLoggedIn]);

  const handleAddData = (values) => {
    const newEntry = {
      key: Date.now(),
      id: Date.now().toString(),
      ...values,
    };

    setData((prevData) => [...prevData, newEntry]);
    setAddingData(false);
    form.resetFields();
    message.success("Data added successfully!");
    console.log("Adding Data: " + newEntry);
  }

  const handleExport = () => {
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

    fetch("https://sheets.googleapis.com/v4/spreadsheets", {
      method: "POST",
      headers: new Headers({
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        properties: {
          title: fileName, // Use the user-provided file name
        },
      }),
    })
      .then((res) => res.json())
      .then((spreadsheet) => {
        console.log("Spreadsheet created:", spreadsheet);
        const spreadsheetId = spreadsheet.spreadsheetId;
        const sheetName = spreadsheet.sheets[0].properties.title;

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
        )
          .then((res) => res.json())
          .then((response) => {
            if (response.error) {
              console.error("Error adding data to sheet:", response.error);
            } else {
              setIsSheetCreated(true);
              setSheetUrl(spreadsheet.spreadsheetUrl); // Save sheet URL
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      });
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "First Name", dataIndex: "first_name", key: "first_name" },
    { title: "Last Name", dataIndex: "last_name", key: "last_name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    { title: "City", dataIndex: "city", key: "city" },
    { title: "Country", dataIndex: "country", key: "country" },
    { title: "Country Code", dataIndex: "country_code", key: "country_code" },
    { title: "State", dataIndex: "state", key: "state" },
    { title: "Street Address", dataIndex: "street_address", key: "street_address" },
    { title: "Job Title", dataIndex: "job_title", key: "job_title" },
    { title: "Company Name", dataIndex: "company_name", key: "company_name" },
    {
      title: "Photo",
      dataIndex: "photo",
      key: "photo",
      render: (photo) => (
        <img
          src={photo}
          alt="profile"
          style={{ width: "50px", borderRadius: "50%" }}
        />
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Button type="primary" onClick={() => setAddingData(true)}>
          Add Data
        </Button>
        <Button type="primary" onClick={() => setExporting(true)}>
          Export to Google Sheet
        </Button>
      </div>

      <Modal
        title="Add New Data"
        visible={addingData}
        onCancel={() => setAddingData(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddData}
        >
          <Form.Item
            label="First Name"
            name="first_name"
            rules={[{ required: true, message: "Please enter the first name" }]}
          >
            <Input placeholder="Enter first name" />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="last_name"
            rules={[{ required: true, message: "Please enter the last name" }]}
          >
            <Input placeholder="Enter last name" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter the email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: "Please select gender" }]}
          >
            <Input placeholder="Enter gender (e.g., Male, Female)" />
          </Form.Item>
          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: "Please enter the city" }]}
          >
            <Input placeholder="Enter city" />
          </Form.Item>
          <Form.Item
            label="Country"
            name="country"
            rules={[{ required: true, message: "Please enter the country" }]}
          >
            <Input placeholder="Enter country" />
          </Form.Item>
          <Form.Item
            label="Country Code"
            name="country_code"
            rules={[{ required: true, message: "Please enter the country code" }]}
          >
            <Input placeholder="Enter country code" />
          </Form.Item>
          <Form.Item
            label="State"
            name="state"
            rules={[{ required: false, message: "Please enter the country code" }]}
          >
            <Input placeholder="Enter state" />
          </Form.Item>
          <Form.Item
            label="Street Address"
            name="street_address"
            rules={[{ required: true, message: "Please enter the street address" }]}
          >
            <Input placeholder="Enter street address" />
          </Form.Item>
          <Form.Item
            label="Job Title"
            name="job_title"
            rules={[{ required: true, message: "Please enter the job title" }]}
          >
            <Input placeholder="Enter job title" />
          </Form.Item>
          <Form.Item
            label="Company Name"
            name="company_name"
            rules={[{ required: true, message: "Please enter the company name" }]}
          >
            <Input placeholder="Enter company name" />
          </Form.Item>
          <Form.Item
            label="Photo"
            name="photo"
            rules={[{ required: true, message: 'Please enter the photo URL' }]}
          >
            <Input placeholder="Enter photo URL" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={isSheetCreated ? "Sheet Created Successfully" : "Enter File Name"}
        visible={exporting}
        onCancel={() => setExporting(false)}
        footer={
          isSheetCreated
            ? null
            : [
                <Button key="cancel" onClick={() => setExporting(false)}>
                  Cancel
                </Button>,
                <Button key="ok" type="primary" onClick={handleExport}>
                  OK
                </Button>,
              ]
        }
      >
        {isSheetCreated ? (
          <p>
            Your sheet was created successfully and added to your Google Drive. You can access it{" "}
            <a href={sheetUrl} target="_blank" rel="noopener noreferrer">
              here
            </a>
            .
          </p>
        ) : (
          <Input
            placeholder="Enter file name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        )}
      </Modal>
    </div>
  );
};

export default UserTable;
