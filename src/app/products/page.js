"use client";
import AppContainer from "@/components/Contaner/container";
import { Space } from "@/components/space/Space";
import { Table, Button, Input, Modal, Popconfirm } from "antd";
import { IoIosRefresh } from "react-icons/io";
import { Image } from "@nextui-org/react";
import { FaEdit, FaFileUpload } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";


const Page = () => {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [newData, setNewData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const showModal = (id) => {
    setSelectedProductId(id);
    const selectedProduct = list.find((product) => product.id === id);
    setEditFormData(selectedProduct);
    setSelectedImage(selectedProduct.image);
  };

  const handleCancel = () => {
    setSelectedProductId(null);
    setOpen(false);
  };

  const handleInputChange = (name, value, isEditForm = false) => {
    let parsedValue = value;
    if (name === "categoryId" && /^\d+$/.test(value)) {
      parsedValue = parseInt(value, 10);
    } else if (name === "price") {
      parsedValue = parseFloat(value);
    }

    if (isEditForm) {
      setEditFormData((prevData) => ({
        ...prevData,
        [name]: parsedValue,
      }));
    } else {
      setNewData((prevData) => ({
        ...prevData,
        [name]: parsedValue,
      }));
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      let url = `http://localhost:3000/api/products/${id}`;
      await fetch(url, {
        method: "DELETE",
      });
      setRefresh((prevRefresh) => prevRefresh + 1);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      let url = `http://localhost:3000/api/products?query=${search}`;
      let res = await fetch(url);
      let jsonData = await res.json();
      setList(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, refresh]);

  const handleEditClick = async () => {
    try {
      let url = `http://localhost:3000/api/products/${selectedProductId}`;
      await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      });
      setRefresh((prevRefresh) => prevRefresh + 1);
    } catch (error) {
      console.error("Error updating data:", error);
    }
    setSelectedProductId(null);
  };

  const handleAddClick = async () => {
    try {
      let url = `http://localhost:3000/api/products`;
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      });
      await setRefresh((prevRefresh) => prevRefresh + 1);
    } catch (error) {
      console.error("Error adding data:", error);
    }
    setOpen(false);
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text) => (
        <Image
          src={text}
          alt={text}
          style={{ borderRadius: "50%", height: "70px", width: "70px" }}
          width={70}
          height={70}
        />
      ),
    },
    {
      title: "name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Category",
      dataIndex: "categoryId",
      key: "categoryId",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Space width={20} />
          <Button onClick={() => showModal(record.id)} size="large">
            <FaEdit />
          </Button>
          <Popconfirm
            title="Delete item?"
            description="Are you sure you want to delete this item?"
            okText="Yes"
            cancelText="No"
            okType="danger"
            onConfirm={() => handleDeleteClick(record.id)}
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Button type="primary" danger size="large">
              <MdDelete />
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <AppContainer width={1300}>
      <Space height="20px" />
      <div className="flex justify-between">
        <Input
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)}
        />
        <Space width="150px" />
        <Button onClick={() => setOpen(true)} size="large">
          Add +
        </Button>
        <Button
          className="default"
          onClick={() => setRefresh((prevRefresh) => prevRefresh + 1)}
          size="large"
        >
          <IoIosRefresh />
        </Button>
      </div>
      <Space height="20px" />
      <Table columns={columns} dataSource={list} loading={loading} />
      {/* Product Details Modal */}
      <Modal
        title="Product Details"
        open={selectedProductId}
        onOk={handleEditClick}
        onCancel={handleCancel}
      >
        {selectedImage && (
          <Image src={selectedImage} alt="Image" width={350} height={350} />
        )}
        <p>name</p>
        <Input
          name="name"
          value={editFormData.name}
          onChange={(e) => handleInputChange("name", e.target.value, true)}
        />
        <p>price</p>
        <Input
          name="price"
          value={editFormData.price}
          onChange={(e) => handleInputChange("price", e.target.value, true)}
        />
        <p>image</p>
        <Input
          name="image"
          value={editFormData.image}
          onChange={(e) => handleInputChange("image", e.target.value, true)}
        />
        <p>categoryId</p>
        <Input
          name="categoryId"
          value={editFormData.categoryId}
          onChange={(e) => handleInputChange("categoryId", e.target.value, true)}
        />
      </Modal>
      {/* Add Modal */}
      <Modal
        title="Product Details"
        open={open}
        onOk={handleAddClick}
        onCancel={handleCancel}
        okType="default"
      >
        <p>name</p>
        <Input
          name="name"
          onChange={(e) => handleInputChange("name", e.target.value)}
        />
        <p>price</p>
        <Input
          name="price"
          onChange={(e) => handleInputChange("price", e.target.value)}
        />
        <p>image</p>
        <Input
          name="image"
          onChange={(e) => handleInputChange("image", e.target.value)}
        />
        <p>categoryId</p>
        <Input
          name="categoryId"
          onChange={(e) => handleInputChange("categoryId", e.target.value)}
        />
        <Space height="10px" />
      </Modal>
    </AppContainer>
  );
};

export default Page;
