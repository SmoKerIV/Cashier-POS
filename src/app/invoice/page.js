"use client";
import React, { useEffect, useState } from "react";
import { Table, Button } from "antd";
import jsPDF from "jspdf";
import "jspdf-autotable";
import AppContainer from "@/components/Contaner/container";
import { Space } from "@/components/space/Space";

const Page = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/api/invoice");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonData = await response.json();

        if (jsonData.success && Array.isArray(jsonData.invoices)) {
          setInvoices(jsonData.invoices);
        } else {
          console.error("Invalid data format:", jsonData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleExportPDF = (invoice) => {
    setSelectedInvoice(invoice);
    exportToPDF(invoice); // Pass the selected invoice as an argument
  };

  const exportToPDF = (invoice) => {
    const { id } = invoice || selectedInvoice; // Use the provided invoice or the selected one
    const dataPDF = invoices.map((item) => ({
      id: item.id,
      date: item.date,
      number: item.number,
      items: item.items?.cart
        ? item.items.cart.map((cartItem) => cartItem.product.name).join(", ")
        : "",
    }));

    const pdf = new jsPDF();
    pdf.autoTable({
      head: [["ID", "Date", "Number", "Items"]],
      body: dataPDF.map((row) => [row.id, row.date, row.number, row.items]),
    });

    pdf.save(`invoice_${id}.pdf`);
    setSelectedInvoice(null);
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Number", dataIndex: "number", key: "number" },
    {
      title: "Items",
      dataIndex: "items",
      key: "items",
      render: (items) => {
        const cart = items?.cart || [];
        const cartItems = cart.map((cartItem) => cartItem.product.name).join(", ");
        return <div>{cartItems}</div>;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <Button onClick={() => handleExportPDF(record)}>Export to PDF</Button>
      ),
    },
  ];

  return (
    <div>
      <AppContainer width={1300}>
        <Space height={20} />
        {loading && <p>Loading...</p>}
        {!loading && invoices.length === 0 && <p>No data available.</p>}
        {!loading && invoices.length > 0 && (
          <Table id="invoiceTable" columns={columns} dataSource={invoices} />
        )}
      </AppContainer>
    </div>
  );
};

export default Page;