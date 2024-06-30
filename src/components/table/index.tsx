import { useState, useEffect } from "react";
import {
  Table as AntTable,
  Button,
  Typography,
  Popconfirm,
  message,
} from "antd";
import mockData from "../../mock.json";
import type { TableProps } from "antd";
import ModalForm from "../form-modal";
import styles from "./index.module.scss";
import { DataType } from "./columns";
const Table = () => {
  const [tableData, setTableData] = useState<Array<DataType>>([]);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isDeletePopOpen, setDeletePopOpen] = useState<Array<string>>([]);

  useEffect(() => {
    // Set mock JSON data from mock file
    setTableData(mockData);
  }, []);

  const Columns: TableProps<DataType>["columns"] = [
    {
      title: "Property name",
      dataIndex: "name",
      key: "name",
      render: (text) => <Typography.Title level={5}>{text}</Typography.Title>,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (amount) => <div>${amount}</div>,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
    },
    {
      title: "Previous application rate",
      dataIndex: "pastAppRate",
      key: "pastAppRate",
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 120,
      render: (_, record: DataType) => (
        <Popconfirm
          title="Delete the task"
          description="Are you sure to delete this task?"
          open={isDeletePopOpen.includes(record.key)}
          onOpenChange={() => {
            setDeletePopOpen([...isDeletePopOpen, record.key]);
          }}
          onConfirm={() => handleDelete(record)}
          onCancel={() => {
            const newVal = isDeletePopOpen.filter((x) => x !== record.key);
            setDeletePopOpen(newVal);
          }}
          okText="Yes"
          cancelText="No"
        >
          <Button danger type="text">
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const handleDelete = (record: DataType) => {
    const newData = tableData.filter((x) => x.key !== record.key);
    setTableData(newData);
    message.success("Successfully deleted");
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleAddNewRecord = (data: any) => {
    const newData = [
      ...tableData,
      {
        key: tableData[tableData?.length ?? 0],
        ...data,
      },
    ];
    setTableData(newData);
    setModalOpen(false);
    message.success("Successfully added");
  };

  return (
    <div>
      <div className={styles.buttonRow}>
        <Button onClick={() => handleModalOpen()}>Add new BTO</Button>
      </div>
      <AntTable
        columns={Columns}
        dataSource={tableData}
        pagination={{ pageSize: 10 }}
        className={styles.table}
        scroll={{ x: 840 }}
      ></AntTable>
      {/* ModalForm to add new record */}
      <ModalForm
        isOpen={isModalOpen}
        handleSubmit={handleAddNewRecord}
        handleClose={handleModalClose}
      />
    </div>
  );
};
export default Table;
