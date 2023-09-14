"use client";

import { FC } from "react";
import { OurFileRouter } from "@/app/api/uploadthing/core";

interface IFileUploadProps {
  endpoint: keyof OurFileRouter;
  value: string;
  onChange: (url?: string) => void;
}

const FileUpload: FC<IFileUploadProps> = ({ endpoint, value, onChange }) => {
  return <div>FileUpload</div>;
};

export default FileUpload;
