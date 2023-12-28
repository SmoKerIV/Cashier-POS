"use client";
import React, { useEffect, useState } from "react";
import { Button, Modal, Image, Table, Space, Pagination } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import Delete from "../../components/Delete/delete";
import Edit from "../../components/Edit/edit";
import AppContainer from "@/components/Container/container";
import styles from "./page.module.css";

function Category() {
  const [selectedCatsId, setSelectedCatsId] = useState(null);
  const [cats, setCats] = useState([]);
  const [list, setList] = useState([]);
  const [skip, setSkip] = useState(0);

  const getCategories = async () => {
    try {
      let res = await fetch("http://localhost:3000/api/categories");
      let jsonData = await res.json();
      setCats(jsonData);
      setList(jsonData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, [skip]);

  const showModal = (id) => {
    setSelectedCatsId(id);
  };

  const handleOk = () => {
    setSelectedCatsId(null);
  };
  const handleCancel = () => {
    setSelectedCatsId(null);
  };
  const handleEditSuccess = () => {
    alert("Catrgory edited successfully");
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Image",
      key: "image",
      render: (_, record) => (
        <Image
          src={record.image}
          alt={"Image"}
          width={70}
          height={70}
          style={{ borderRadius: "50%" }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => showModal(record.id)}
            style={{ backgroundColor: "white", color: "black" }}
          >
            <EyeOutlined />
          </Button>
          <Modal
            title="Product Details"
            visible={selectedCatsId === record.id}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <h1>{record.title}</h1>
            <Image width={200} src={record.thumbnail} alt={record.title} />
            <p>{record.description}</p>
          </Modal>
          <Edit
            id={record.id}
            onEdit={handleEditSuccess}
            productDetails={record}
          />
          <Delete id={record.id} />
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className={styles.table_container}>
        <AppContainer>
          <div>
            <div className={styles.table1}>
              <Table columns={columns} dataSource={list} pagination={false} />
            </div>
            <br />
            <center>
              <Pagination
                defaultCurrent={1}
                total={100}
                showSizeChanger={false}
                onChange={(page) => setSkip((page - 1) * 10)}
              />
            </center>
            <br />
          </div>
        </AppContainer>
      </div>
    </>
  );
}

export default Category;
