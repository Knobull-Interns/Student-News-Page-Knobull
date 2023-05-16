import { useEffect, useState } from 'react'
import { Button, Popconfirm, Row, Col, message } from 'antd'
import ClassificationModal from '@/components/modal/classification'
import { getClassificationList, deleteClassification } from '@/api'
import './index.less'
import MyTable from '@/components/table'
import { MapKey, ResponseUserInfo } from '@/types'

export default function User() {
  const [tableData, setData] = useState<ResponseUserInfo[]>([])
  const [tableCol, setCol] = useState<MapKey>([
    {
      dataIndex: '_id',
      key: 'classificationId',
      title: 'Classification Id',
      align: 'center'
    },
    {
      dataIndex: 'name',
      key: 'classificationName',
      title: 'Classification Name',
      align: 'center'
    },
    {
      dataIndex: 'active',
      key: 'active',
      title: 'Action',
      align: 'center',
      render: (text: string, record: any) => (
        <>
          <Button type="link" onClick={() => showInfoModal(record._id, true)}>
            Edit
          </Button>
          <Popconfirm
            onConfirm={() => delClassification(record._id)}
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
  ])
  const [total, setTotal] = useState(0)
  const [showModal, setShow] = useState(false)
  const [chooseId, setId] = useState<string>(null)

  useEffect(() => {
    getClassificationData()
  }, [])

  // 显示弹窗
  const showInfoModal = (id: string, type: boolean) => {
    if (id) {
      console.log(id)
      setId(id)
    } else {
      setId(null)
    }
    setShow(type)
  }

  // 删除分类
  const delClassification = (id: string) => {
    deleteClassification({ id }).then((res) => {
      const { message: msg, status } = res;
      if (status === 0) {
        message.success(msg);
        getClassificationData();
      }
    });
  }

  const renderTitle = () => (
    <Row justify="space-between" gutter={80}>
      <Col style={{ lineHeight: '32px' }}>Classification List</Col>
      <Col>
        <Button type="primary" onClick={() => showInfoModal(null, true)}>
          Add Classification
        </Button>
      </Col>
    </Row>
  )
  const getClassificationData = () => {
    getClassificationList().then(res => {
      setData(res.data)
    })
  }
  const updateClassificationData = () => {
    getClassificationData()
  }

  return (
    <div className="user-container">
      <MyTable title={renderTitle} dataSource={tableData} rowKey="_id" columns={tableCol} pagination={false} />
      <ClassificationModal
        isShow={showModal}
        classification_id={chooseId}
        onCancel={showInfoModal}
        onOk={updateClassificationData}
      />
    </div>
  )
}

User.route = { [MENU_PATH]: '/articleManagement/articleClassification' }
