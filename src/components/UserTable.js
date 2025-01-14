import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Button, Form , Modal, Input, message } from "antd";
import { initGoogleApi, fetchData, exportToGoogleSheets } from "../services/dataService";

const UserTable = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [addingData, setAddingData] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isSheetCreated, setIsSheetCreated] = useState(false);
  const [sheetUrl, setSheetUrl] = useState("");
  const [deletingRow, setDeletingRow] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [form] = Form.useForm();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {  
    initGoogleApi()
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData()
        .then((transformedData) => {
          setData(transformedData);
          setLoading(false);
        })
        .catch(() => setLoading(false));
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

  const showDeleteModal = (row) => {
    setDeletingRow(row);
    setDeleteModalVisible(true);
  };
  
  const handleDelete = () => {
    setData((prevData) => prevData.filter((item) => item.key !== deletingRow.key));
    setDeleteModalVisible(false);
    message.success(`Deleted row with ID: ${deletingRow.id}`);
    setDeletingRow(null);
  };
  
  const cancelDelete = () => {
    setDeletingRow(null);
    setDeleteModalVisible(false);
  };

  const handleExport = async () => {
    try {
      const url = await exportToGoogleSheets(data, fileName);
      setIsSheetCreated(true);
      setSheetUrl(url);
      message.success("Data exported successfully!");
    } catch {
      message.error("Failed to export data!");
    }
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
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Button danger type="primary" onClick={() => showDeleteModal(record)}>
          Delete
        </Button>
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
        title="Confirm Delete"
        visible={deleteModalVisible}
        onOk={handleDelete}
        onCancel={cancelDelete}
        okText="Confirm"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this entry?</p>
        {deletingRow && (
          <p>
            <strong>{deletingRow.first_name} {deletingRow.last_name}</strong>
          </p>
        )}
      </Modal>

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
