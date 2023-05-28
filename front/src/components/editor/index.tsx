import '@wangeditor/editor/dist/css/style.css' // 引入 css

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IEditorConfig } from '@wangeditor/editor'
import { getToken } from "@/utils";

type InsertFnType = (url: string, alt: string, href: string) => void

const MyEditor = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => {
    return {
      setHtml: setHtml
    }
  })
  // editor 实例
  const [editor, setEditor] = useState(null)

  // 编辑器内容
  const [html, setHtml] = useState('<p></p>')

  useImperativeHandle(props.onRef, () => {
    console.log(1)
    return {
      setHtml: setHtml
    }
  })

  useEffect(() => {
    props.onChange(html)
  }, [html])

  // 工具栏配置
  const toolbarConfig = {
    excludeKeys: [
      'uploadVideo'
    ]
  }

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入内容...',
    autoFocus: false,
    MENU_CONF: {}
  }

  editorConfig.MENU_CONF['uploadImage'] = {
    server: '/api/upload',
    fieldName: 'files',
    customInsert(res: any, insertFn: InsertFnType) {
      insertFn(res.message, '', '')
    },
    headers: {
      Authorization: getToken()
    }
  }

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  return (
    <>
      <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: '1px solid #ccc' }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={editor => setHtml(editor.getHtml())}
          mode="default"
          style={{ height: '500px', overflowY: 'hidden' }}
        />
      </div>
    </>
  )
})

export default MyEditor
