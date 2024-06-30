import { FC, useState } from "react";
import { Modal, Button, Form, Input, InputNumber, Space, Select } from "antd";
import { DataType } from "../table/columns";

type ModalFormProps = {
  isOpen: boolean;
  handleSubmit: (data: any) => void;
  handleClose: () => void;
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const ModalForm: FC<ModalFormProps> = ({
  isOpen,
  handleSubmit,
  handleClose,
}) => {
  const [locationRes, setLocationRes] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const handleSearchLocation = (keyword: string) => {
    //Fetch SG address from one map api
    if (keyword.length) {
      fetch(
        `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${keyword}&returnGeom=N&getAddrDetails=Y&pageNum=1`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          } else {
            return response.json();
          }
        })
        .then((res) => {
          if (res.found) {
            const results = res.results;
            const newOptions = results.map((res: any) => {
              return {
                label: res.ADDRESS,
                value: res.ADDRESS,
              };
            });
            setLocationRes(newOptions);
          }
        })
        .catch((error) => console.log(error));
    }
  };

  const handleChange = (newLocation: string) => {
    setSelectedLocation(newLocation);
  };

  return (
    <Modal
      open={isOpen}
      title="Add new BTO"
      footer={null}
      onCancel={handleClose}
      destroyOnClose={true}
    >
      <Form
        name="bto-form"
        onFinish={handleSubmit}
        preserve={false}
        {...layout}
        style={{ maxWidth: 600 }}
      >
        <Form.Item<DataType>
          label="Property name"
          name="name"
          rules={[{ required: true, message: "Please enter property name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<DataType>
          label="Address"
          name="address"
          rules={[{ required: true, message: "Please enter address" }]}
        >
          <Select
            showSearch
            value={selectedLocation}
            placeholder="Search for location"
            defaultActiveFirstOption={false}
            suffixIcon={null}
            filterOption={false}
            onSearch={handleSearchLocation}
            onChange={handleChange}
            notFoundContent="No result"
            options={locationRes}
          />
        </Form.Item>

        <Form.Item<DataType>
          label="Price"
          name="price"
          rules={[
            { required: true, message: "Please enter price" },
            { type: "number", min: 0, message: "Please enter a valid price" },
          ]}
        >
          <InputNumber<number>
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) =>
              value?.replace(/\$\s?|(,*)/g, "") as unknown as number
            }
          />
        </Form.Item>

        <Form.Item<DataType>
          label="Rating"
          name="rating"
          rules={[
            { required: true, message: "Please enter rating" },
            {
              type: "number",
              message: "Please enter a valid number from 0-10",
              min: 0,
              max: 10,
            },
          ]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item<DataType>
          label="Past application rate"
          name="pastAppRate"
          rules={[
            { required: true, message: "Please enter application rate" },
            {
              type: "number",
              message: "Please enter a valid number from 0",
              min: 0,
            },
          ]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Space>
            <Button htmlType="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default ModalForm;
