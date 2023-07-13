import "@wangeditor/editor/dist/css/style.css"; // import css

import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import { IEditorConfig, i18nChangeLanguage } from "@wangeditor/editor";
import { getToken } from "@/utils";

i18nChangeLanguage("en");

type InsertFnType = (url: string, alt: string, href: string) => void;

const MyEditor = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => {
    return {
      setHtml: setHtml,
    };
  });
  // editor instance
  const [editor, setEditor] = useState(null);

  // editor content
  const [html, setHtml] = useState("<p></p>");

  useImperativeHandle(props.onRef, () => {
    return {
      setHtml: setHtml,
    };
  });

  useEffect(() => {
    props.onChange(html);
  }, [html]);

  // toolbar configuration
  const toolbarConfig = {
    excludeKeys: ["uploadVideo"],
  };

  // editor configuration
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "please enter content...",
    autoFocus: false,
    MENU_CONF: {},
  };

  editorConfig.MENU_CONF["uploadImage"] = {
    server: "/api/upload",
    fieldName: "files",
    customInsert(res: any, insertFn: InsertFnType) {
      insertFn(res.message, "", "");
    },
    headers: {
      Authorization: getToken(),
    },
  };

  // promptly destory editor, important!
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  return (
    <>
      <div style={{ border: "1px solid #ccc", zIndex: 100 }}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: "1px solid #ccc" }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={(editor) => setHtml(editor.getHtml())}
          mode="default"
          style={{ height: "500px", overflowY: "hidden" }}
        />
      </div>
    </>
  );
});

export default MyEditor;
