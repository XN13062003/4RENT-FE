import { Button, Spin, message, Typography } from "antd";
import classNames from "classnames";
import React, { useRef } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type Props = {
  initSrc?: string;
  onChange?: (fileSrc: string) => void;
  className?: string;
};
export default function UploadFileInput({
  initSrc,
  onChange,
  className,
}: Props) {
  const accessToken = localStorage.getItem('refreshToken')
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadService = useMutation({
    mutationFn: (formData: FormData) =>
      axios.post("http://localhost:6868/api/application/create-pdf", formData, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
          },
      }),
    onSuccess: (data) => {
      // @ts-ignore
      if (onChange) onChange(data.pdfPath);
    },
  });

  const handleUploadFile = async (files: FileList | null) => {
    if (!files || files.length <= 0) return;
    try {
      const formData = new FormData();
      formData.append("file", files[0]);
      uploadService.mutate(formData);
    } catch (error) {
      message.error("Lưu file không thành công!");
    }
  };
  return (
    <>
      <input
        type="file"
        ref={inputRef}
        className="!hidden"
        onChange={(event) => handleUploadFile(event.target.files)}
      />
      {uploadService.isSuccess && (
        // @ts-ignore
        <Typography.Link href={`http://localhost:6868/${uploadService.data.pdfPath}`} target="_blank">
          Đường dẫn đến PDF đã tạo
        </Typography.Link>
      )}
      <div>
        <Button
          icon={<UploadOutlined />}
          className="absolute z-10 top-2 right-4"
          onClick={() => inputRef.current?.click()}
        >
          Upload
        </Button>
      </div>
    </>
  );
}
