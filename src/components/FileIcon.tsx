import { ReactComponent as docIcon } from '../icons/doc.svg';
import fileIcon from '../icons/file.svg';
import jpgIcon from '../icons/jpg.svg';
import mpgIcon from '../icons/mp3.svg';
import pdfIcon from '../icons/pdf.svg';
import pptIcon from '../icons/ppt.svg';
import xlsIcon from '../icons/xls.svg';
import zipIcon from '../icons/zip.svg';

import React from 'react';

type Props = {
    extension: string;
    size: number;
    className: string;
};

const FileIcon = (props: Props) => {
    const { extension, size = 16, className = '' } = props;

    const Icon = () => {
        switch (extension) {
            case 'doc':
            case 'docx':
                return docIcon;
            case 'jpg':
            case 'jpeg':
                return jpgIcon;
            case 'mp3':
            case 'mp4':
                return mpgIcon;
            case 'pdf':
                return pdfIcon;
            case 'ppt':
            case 'pptx':
                return pptIcon;
            case 'xls':
                return xlsIcon;
            case 'zip':
            case '7z':
            case 'rar':
                return zipIcon;
            default:
                return fileIcon;
        }
    };

    return <Icon />;
};

export default FileIcon;
