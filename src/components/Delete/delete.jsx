import React from "react";
import { Button, Popconfirm } from "antd";
import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";


function Delete({ id }) {
  const handleDelete = () => {
    fetch(`http://localhost:3000/api/products/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to delete product with ID ${id}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        console.log(`Product with ID ${id} deleted successfully`);
        alert("Product deleted successfully");
      })
      .catch((error) => {
        console.error(`Error deleting product with ID ${id}:`, error);
      });
  };
  return (
    <div>
      <Popconfirm
        title=""
        description="هل انت واثق من حذفه نهائيا ؟"
        onConfirm={handleDelete}
        okText="نعم"
        cancelText="لا"
      >
        <Button
          onClick={() => showModal(record.id)}
          style={{ backgroundColor: 'white', color: 'black' }}
        >
          <QuestionCircleOutlined style={{ color: 'orange' }} />
        </Button>
  
        <Button
          type="dashed"
          danger
          style={{ backgroundColor: "#2A3333", color: "white" }}
        >
          <DeleteOutlined />
        </Button>
      </Popconfirm>
    </div>
  );
  
  }
export default Delete;
