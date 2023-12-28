"use client";
import React, { useEffect, useState } from "react";
import { Button, Modal, Image, Table, Space, Pagination } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import Delete from "../../components/Delete/delete";
import Edit from "../../components/Edit/edit";
import AppContainer from "@/components/Container/container";
import styles from "./page.module.css";

function Product() {
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [list, setList] = useState([]);

  const getProducts = async (cats) => {
    let url = "http://localhost:3000/api/products";
    if (cats) url = `http://localhost:3000/api/products?cat=${cats}`;

    try {
      let res = await fetch(url);
      let jsonData = await res.json();
      setList(jsonData);
    } catch (error) {}
  };

  useEffect(() => {
    getProducts();
  }, []);
  const showModal = (id) => {
    setSelectedProductId(id);
  };

  const handleOk = () => {
    setSelectedProductId(null);
  };
  const handleCancel = () => {
    setSelectedProductId(null);
  };
  const handleEditSuccess = () => {
    alert("Product edited successfully");
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
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price}$`,
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
            open={selectedProductId === record.id}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <h1>{record.title}</h1>
            <Image width={200} src={record.thumbnail} alt={record.title} />
            <p>{record.description}</p>
            <p>{record.price}$</p>
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

export default Product;
