import React from "react";
import { useState } from "react";
import "./App.css";
import axios from "axios";
import { nanoid } from "nanoid";
import { ImageFileFormat } from "./ImgFileType";

const demoData = [
  {
    fileName: "sample.jpeg",
    fileSize: "20 mb",
    fileType: "png",
    fileImageFormat: "pdf",
    id: nanoid(),
  },
];

let currentID;

const App = () => {
  const [fileList, setFileList] = useState(demoData);
  const [uploadPercent, setUploadPercent] = useState(0);

  const HandleOnDrop = async (e) => {
    const fileToUpload = e.target.files[0];

    const fileName = fileToUpload.name;
    const fileSize = fileToUpload.size;
    const fileType = fileToUpload.type;
    const fileImageFormat = fileType.split("/")[1];
    currentID = nanoid();

    const newFile = {
      fileName: fileName,
      fileSize: fileSize,
      fileType: fileType,
      id: currentID,
      fileImageFormat: fileImageFormat,
    };
    setFileList([...fileList, newFile]);

    const newFormData = new FormData();
    newFormData.append("file", fileToUpload);
    try {
      const response = await axios.post("/uploadFile", newFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const uploadPercent = parseInt(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          );

          setUploadPercent(uploadPercent);
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const DeleteFile = (id) => {
    setFileList([...fileList].filter((file) => file.id !== id));
  };

  return (
    <div className="app">
      <h2 className="title">file upload</h2>
      <main>
        <div className="uploadContainer">
          <div className="uploadContainerContent">
            <div className="uploadBox">
              <span class="material-symbols-outlined">file_upload</span>
              <div className="uploadText">drag files to upload</div>
            </div>
            <div className="uploadBtn">
              <button>Choose File</button>
            </div>
            <input type="file" name="file" onChange={HandleOnDrop} />
          </div>
        </div>
        <div className="previewContainer">
          <p className="previewTitle">Files</p>
          <div className="previewContainerContent">
            {fileList.length > 0 ? (
              <ul className="files">
                {fileList.map((file) => {
                  return (
                    <li className="file" key={file.id}>
                      <div className="imgContainer">
                        <img
                          src={
                            ImageFileFormat[file.fileImageFormat] ||
                            ImageFileFormat.default
                          }
                          alt=""
                        />
                      </div>
                      <div className="fileDisplay">
                        <div className="nameSizeDelete">
                          <div className="left">
                            <span className="name">{file.fileName}</span>
                            <span className="size">{file.fileSize}</span>
                          </div>
                          <div
                            className="right"
                            onClick={() => DeleteFile(file.id)}
                          >
                            <span class="material-symbols-outlined">close</span>
                          </div>
                        </div>
                        <div className="progress">
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{
                              width:
                                file.id === currentID
                                  ? `${uploadPercent}%`
                                  : "100%",
                              height: "5px",
                              borderRadius: "5px",
                            }}
                          ></div>
                        </div>
                        <div className="progressValue">
                          {file.id === currentID ? `${uploadPercent}%` : "100%"}
                          <span>
                            {" "}
                            {file.id === currentID && uploadPercent !== 100
                              ? `uploading...`
                              : `completed`}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="noFilesPreview">No Files </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
