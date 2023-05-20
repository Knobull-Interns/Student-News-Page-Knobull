import { useEffect, useState } from "react";
import "./index.less";
import {
  Form,
  Input,
  InputNumber,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
  message,
  Upload
} from "antd";
import type { UploadChangeParam } from 'antd/es/upload';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useNavigate } from "react-router-dom";
import { useDispatchLayout } from "@/store/hooks";
import { getClassificationList, uploadImage } from '@/api'
import Editor from '@/components/editor'
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

function RegistrationForm() {
  const [form] = Form.useForm();
  const navigate = useNavigate()
  const { stateChangeLayout } = useDispatchLayout()
  const [articleClassification, setArticleClassification] = useState([])
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    banner: '',
    content: ''
  })
  useEffect(() => {
    getClassificationList().then(res => {
      setArticleClassification(res.data.map(item => ({
        value: item._id,
        label: item.name
      })))
    })
    return () => {
      stateChangeLayout("pop")
    }
  }, [])

  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
  };
  const back = () => {
    navigate(-1)
  }

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (file) => {
        setLoading(false);
        /* setData({
          banner: url
        }) */
        // setImageUrl(url);
      });
    }
  };

  const handleUpload = async options => {
    const { onSuccess, onError, file } = options;

    const fmData = new FormData();
    fmData.append("files", file);
    try {
      const res = await uploadImage(fmData);
      setData({
        banner: res.message
      })
      console.log(data)
      onSuccess(res);
    } catch (err) {
      const error = new Error("Some error");
      onError({ err });
    }
  }

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  function editorChange(e) {
    setData({
      content: e
    })
  }

  return (
    <div>
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        className="index-form"
        initialValues={data}
        scrollToFirstError
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[
            {
              required: true,
              message: "Please input your title!",
            },
          ]}
        >
          <Input onChange={(e) => setData({ title: e.target.value })} />
        </Form.Item>

        <Form.Item
          name="articleDesc"
          label="ArticleDesc"
        >
          <Input onChange={(e) => setData({ articleDesc: e.target.value })} />
        </Form.Item>

        <Form.Item
          name="classification"
          label="Article Classification"
          rules={[
            {
              required: true,
              message: "Please select article classification!",
            },
          ]}
        >
          <Select
            style={{ width: 200 }}
            options={articleClassification}
            onChange={(e) => setData({ classification: e })}
          />
        </Form.Item>
        <Form.Item
          name="charge"
          label="Charge"
        >
          <InputNumber addonAfter='$' />
        </Form.Item>
        <Form.Item
          name="banner"
          label="Banner"
          rules={[
            {
              required: true,
              message: "Please upload banner!",
            },
          ]}
        >
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={handleChange}
            customRequest={handleUpload}
          >
            {data.banner ? <img src={data.banner} alt="banner" style={{ width: '100%' }} /> : uploadButton}
          </Upload>
        </Form.Item>

        <Form.Item
          name="content"
          label="Content"
        >
          <Editor onChange={editorChange} />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Add Article
          </Button>
          <Button danger onClick={back} type='link'>
            返回上一页
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default RegistrationForm;

RegistrationForm.route = {
  [MENU_PATH]: "/articleManagement/updateArticle",
  [MENU_LAYOUT]: 'FULLSCREEN'
};
