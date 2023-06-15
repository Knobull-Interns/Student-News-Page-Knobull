import { useState } from "react";
import { Button, Row, Col, Popconfirm, message } from "antd";
import MyPagination, { PageInfo } from "@/components/pagination";
import { getArticleList, deleteArticle } from "@/api";
import "./index.less";
import MyTable from "@/components/table";
import { MapKey, ResponseUserInfo } from "@/types"
import { useNavigate } from 'react-router-dom'

export default function Article() {
  const [tableData, setData] = useState<ResponseUserInfo[]>([]);
  const [tableCol, setCol] = useState<MapKey>([
    {
      dataIndex: '_id',
      key: 'articleId',
      title: 'Article Id',
      align: 'center'
    },
    {
      dataIndex: 'title',
      key: 'title',
      title: 'Title',
      align: 'center'
    },
    {
      dataIndex: 'desc',
      key: 'desc',
      title: 'Desc',
      align: 'center'
    },
    {
      dataIndex: 'category',
      key: 'category',
      title: 'Article Category',
      align: 'center'
    },
    {
      dataIndex: 'banner',
      key: 'banner',
      title: 'Banner',
      align: 'center',
      render: (text: string | null) => text && <img width={80} height={50} src={text} />
    },
    {
      dataIndex: 'charge',
      key: 'charge',
      title: 'Charge',
      align: 'center',
      render: (text: number | null) => <div>{(text && text !== 0) ? text + '$' : 'free'}</div>
    },
    {
      dataIndex: 'active',
      key: 'active',
      title: 'Action',
      align: 'center',
      width: 120,
      render: (text: string, record: any) => (
        <>
          <Button type="link" onClick={() => editArticle(record._id)}>
            Edit
          </Button>
          <Popconfirm
            onConfirm={() => delArticle(record._id)}
            okText="Confirm"
            title="Confirm deletion？"
            cancelText="Cancel"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      )
    }
  ]);
  const [total, setTotal] = useState(0);
  const [showModal, setShow] = useState(false);
  const [chooseId, setId] = useState<UserID>(null);
  const [pageData, setPage] = useState<PageInfo>({ page: 1 });
  const navigate = useNavigate()

  const renderTitle = () => (
    <Row justify="space-between" gutter={80}>
      <Col style={{ lineHeight: "32px" }}>Article List</Col>
      <Col>
        <Button type="primary" onClick={() => addArticle()}>
          Add Article
        </Button>
      </Col>
    </Row>
  )
  // 新增文章
  const addArticle = () => {
    navigate('/admin/articleManagement/updateArticle')
  }
  // 编辑文章
  const editArticle = (id: string) => {
    navigate(`/admin/articleManagement/updateArticle?id=${id}`)
  }
  // 删除文章
  const delArticle = (id: string) => {
    deleteArticle({ id }).then(res => {
      const { message: msg, status } = res;
      if (status === 0) {
        message.success(msg);
        getArticleData(pageData);
      }
    })
  }
  const getArticleData = (data: any) => {
    setPage(data);
    getArticleList(data).then((res) => {
      const { data, status, total } = res;
      if (status === 0 && data) {
        data.map(item => {
          item.category = item.categoryId.name
        })
        setTotal(total);
        setData(data);
      }
    });
  }

  return (
    <div className="user-container">
      <MyTable
        title={renderTitle}
        dataSource={tableData}
        rowKey="_id"
        columns={tableCol}
        pagination={false}
      />
      <MyPagination
        page={pageData.page}
        total={total}
        immediately={getArticleData}
        change={getArticleData}
      />
    </div>
  );
}

Article.route = { [MENU_PATH]: "/admin/articleManagement/article" };
