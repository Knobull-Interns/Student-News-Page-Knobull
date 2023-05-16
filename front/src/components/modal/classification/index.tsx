import { useEffect, useState } from 'react'
import { Modal, message, FormInstance } from 'antd'
import MyForm, { FormItemData } from '@/components/form'
import { addClassification, getClassificationDetail, editClassification } from '@/api'

export type ClassificationID = string
interface ClassificationProps {
  classification_id: ClassificationID
  isShow: boolean
  onCancel: (id: ClassificationID, s: boolean) => void
  onOk: () => void
}

const initFormItems: FormItemData[] = [
  {
    itemType: 'input',
    itemProps: {
      name: 'name',
      rules: [{ required: true, message: 'Please fill in the category name' }],
      label: 'Classification name'
    },
    childProps: {
      placeholder: 'Classification name'
    }
  }
]

export default function ClassificationModal({ classification_id, isShow, onCancel, onOk }: ClassificationProps) {
  const [form, setForm] = useState<FormInstance | null>(null)
  const [formItems, setItems] = useState<FormItemData[]>([])

  useEffect(() => {
    if (classification_id && form) {
      getClassificationDetail({ _id: classification_id }).then(res => {
        if (res.data) {
          form.setFieldsValue(res.data)
        }
      })
      let items = initFormItems.map(i => ({ ...i }))
      setItems(items)
    } else if (!classification_id) {
      // set formItem
      let items = initFormItems.map(i => ({ ...i }))
      setItems(items)
    }
  }, [classification_id, form])

  const submit = () => {
    form &&
      form.validateFields().then(values => {
        let modify = Boolean(classification_id)
        let fn = modify ? editClassification : addClassification
        if (modify) {
          values.id = classification_id
        }
        fn(values).then(res => {
          if (res.status === 0) {
            message.success(res.message)
            close()
            onOk()
          }
        })
      })
  }
  const close = () => {
    form && form.resetFields()
    onCancel(null, false)
  }
  return (
    <Modal
      maskClosable={false}
      title={classification_id ? 'Edit Classification' : 'Add Classification'}
      open={isShow}
      okText="Confirm"
      cancelText="Cancel"
      onCancel={close}
      onOk={submit}>
      <MyForm handleInstance={setForm} items={formItems} />
    </Modal>
  )
}
