// EmailEditor.js
import React, { useState, useEffect } from 'react';
import { EditorState, convertToRaw, convertFromRaw, convertFromHTML, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const EmailEditor = (props) => {
  const { mailContent, setMailContent } = props;
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [contentLoaded, setContentLoaded] = useState(false);

  const handleEditorStateChange = (newState) => {
    setEditorState(newState);
    setMailContent(draftToHtml(convertToRaw(editorState.getCurrentContent())));
  };

  useEffect(() => {
    if (mailContent && !contentLoaded) {
        const blocksFromHtmlContent = convertFromHTML(mailContent);
        const { contentBlocks, entityMap } = blocksFromHtmlContent;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        setEditorState(EditorState.createWithContent(contentState));
        setContentLoaded(true);
    }
  }, [mailContent]);

  return (
    <div>
      <div className="editor-container">
        <Editor
          editorState={editorState}
          wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            toolbarClassName="toolbar-class"

          onEditorStateChange={handleEditorStateChange}
        //   toolbar={{
        //     image: {
        //       uploadEnabled: true,
        //       uploadCallback: handleImageUpload,
        //       previewImage: true,
        //     },
        //   }}
        />
      </div>
    </div>
  );
};

const handleImageUpload = (file) => {
  // Implement image upload functionality here
  return new Promise((resolve, reject) => {
    // Simulate image upload with setTimeout
    setTimeout(() => {
      // Resolve with image URL or reject with error
      resolve('https://example.com/image.jpg');
    }, 2000);
  });
};

export default EmailEditor;
