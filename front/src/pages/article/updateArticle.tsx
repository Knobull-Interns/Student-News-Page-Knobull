import { useEffect, useState, useRef } from "react";
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
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatchLayout } from "@/store/hooks";
import { getClassificationList, uploadImage, addArticle, getArticleDetail, editArticle } from '@/api'
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
  const [searchParams, setSearchParams] = useSearchParams()
  const { stateChangeLayout } = useDispatchLayout()
  const [articleClassification, setArticleClassification] = useState([])
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState('')
  const [content, setContent] = useState('')
  const myEditor = useRef()
  useEffect(() => {
    getClassificationList().then(res => {
      setArticleClassification(res.data.map(item => ({
        value: item._id,
        label: item.name
      })))
    })
    if (searchParams.get('id')) {
      getArticleDetail({ id: searchParams.get('id') }).then(res => {
        form.setFieldsValue(res.data)
        setBanner(res.data.banner)
        setContent(res.data.content)
        myEditor.current.setHtml(res.data.content)
      })
    }
    return () => {
      stateChangeLayout("pop")
    }
  }, [])

  const onFinish = (values: any) => {
    const params = {
      ...values,
      id: searchParams.get('id'),
      banner,
      content
    }
    const api = params.id ? editArticle : addArticle
    api(params).then(res => {
      if (res.status === 0) {
        message.success(`succeed in ${params.id ? 'edit' : 'saving new'} article!`);
        back()
      }
    })
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
      setBanner(res.message)
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
    setContent(e)
  }

  return (
    <div>
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        className="index-form"
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
          <Input />
        </Form.Item>

        <Form.Item
          name="desc"
          label="ArticleDesc"
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="categoryId"
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
            {banner ? <img src={banner} alt="banner" style={{ width: '100%' }} /> : uploadButton}
          </Upload>
        </Form.Item>

        <Form.Item
          name="content"
          label="Content"
        >
          <Editor ref={myEditor} onChange={editorChange} />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Submit
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
  [MENU_PATH]: "/admin/articleManagement/updateArticle",
  [MENU_LAYOUT]: 'FULLSCREEN'
};
