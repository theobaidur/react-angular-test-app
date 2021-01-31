import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { DropzoneTab } from '../scanComponent/scanComponent';
import base64toBlob from '../../../utils/base64toBlob';
import { config } from '../../../config';
import signalRService from '../../../services/signalrService';
import { ProgressPopup } from './components/progressPopup.component';
import scanProvider from '../../../providers/scanProvider';
import ModalWindow from '../modalWindow';
import useEffectOnlyOnce from '../../../utils/useEffectOnlyOnce';

interface IStartFotoScan {
  templateName?: string;
  isPdf: boolean;
  onClose?: any;
  onInit?: any;
}

export const UploadFiles: React.FC<IStartFotoScan> = ({ onInit, templateName, onClose, isPdf }) => {
  const [key, setKey] = useState<string>();
  const { t } = useTranslation(['upload']);
  const localTranslation = useTranslation([`scanExceptions`]);
  const lt = localTranslation.t;
  const [imgs, setImgs] = useState<Array<string>>([]);
  const [pdfs, setPdfs] = useState<Array<File>>([]);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  useEffectOnlyOnce(() => {
    onInit(setKey);
  });

  const updateDocScan = (fd: FormData) =>
    scanProvider.updateDocScan(
      fd,
      () => {},
      (err) => console.log(err)
    );

  const sendToServer = () => {
    setIsWaiting(true);
    signalRService.connect(
      `${config.ocrHubUrl}?scanKey=${key}`,
      () => {
        sendToServerInternal();
      },
      () => {
        setIsWaiting(false);
        alert(lt(`scanExceptions.ConnectionIssues`));
      },
      (p: string) => {
        setProgress(parseInt(p));
      }
    );
  };

  const sendToServerInternal = () => {
    setIsWaiting(true);
    const ocrFD = new FormData();
    if ((imgs && imgs.length > 0) || (pdfs && pdfs.length > 0)) {
      if (imgs && imgs.length > 0)
        imgs.forEach((scan: string, key: number) => {
          let stringImage: string = scan.replace(/^data:image\/\w+;base64,/, '');
          const file: Blob = base64toBlob(stringImage, 'image/jpeg');
          ocrFD.append(`pic-${key}`, file, `pic-${key}.jpeg`);
        });
      if (pdfs && pdfs.length > 0) pdfs.forEach((item: File) => ocrFD.append('docs[]', item));

      ocrFD.append('returnImages', '1');
      ocrFD.append('scanKey', key || '');

      scanProvider.scanPhotosOrPDFs(
        templateName,
        ocrFD,
        (res: any) => {
          if (res.success) {
            const updateScanFD = new FormData();
            updateScanFD.append('status', '2');
            updateScanFD.append('data', JSON.stringify(res.response));
            updateScanFD.append('key', key || '');
            updateScanFD.append('action', 'updateDocScan');
            let images: Array<string> = JSON.parse(res.response.Images);
            images &&
              images.length > 0 &&
              images.forEach((scan: string, key: number) => {
                updateScanFD.append(`images[]`, `data:image/jpeg;base64,${scan}`);
              });
            updateDocScan(updateScanFD);
          } else {
            alert(lt(`scanExceptions.${res.error.code}`, { values: res.error.values }));
            setIsWaiting(false);
          }
        },
        (err: any) => {
          console.log(err);
          if (err && err.response && err.response.status === 401) {
            alert(lt(`scanExceptions.AuthIssues`));
          } else {
            alert(lt(`scanExceptions.ConnectionIssues`));
          }
          setIsWaiting(false);
        }
      );
    }
  };

  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    acceptedFiles.forEach((item: File) => {
      if (item && item.type !== 'application/pdf') {
        var reader = new FileReader();
        reader.onload = (evt: any) => {
          setImgs((x: Array<string>) => x.concat(evt.target.result));
        };
        reader.readAsDataURL(item);
      } else {
        setPdfs((x: Array<File>) => [...x, item]);
      }
    });
  }, []);

  const removeImage: (x: number) => void = (x: number) => {
    setImgs((items: Array<string>) => items.splice(x, 1) && [...items]);
  };
  const removePdf: (x: number) => void = (x: number) => {
    setPdfs((items: Array<File>) => items.splice(x, 1) && [...items]);
  };

  return (
    <ModalWindow
      isOpen={true}
      toggle={() => undefined}
      onClose={() => onClose(key)}
      height={240}
      title={t('header.title')}
      subTitle={
        isPdf
          ? t('header.descriptionPdf', { templateName: templateName || 'PK' })
          : t('header.descriptionImg', { templateName: templateName || 'PK' })
      }
    >
      {isWaiting ? (
        <ProgressPopup progress={progress}></ProgressPopup>
      ) : (
        <DropzoneTab
          isIkAuszugPart
          imgs={imgs}
          pdfs={pdfs}
          dragZoneText={t('dragAreaText')}
          btnText={t('sendBtnText')}
          accept={isPdf ? 'application/pdf' : 'image/*'}
          sendToServer={sendToServer}
          onDrop={onDrop}
          remove={removeImage}
          removePdf={removePdf}
        />
      )}
    </ModalWindow>
  );
};
