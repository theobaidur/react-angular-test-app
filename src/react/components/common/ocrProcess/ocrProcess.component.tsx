import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import base64toBlob from '../../../utils/base64toBlob';
import { config } from '../../../config';
import { KFormRow, KFormCol } from '../../KForm/KForm_styles';
import KRoundButton from '../../KForm/KRoundButton/kRoundButton';
import { SmallGeneralText, TextList, TextListItem, TextListNumber, PrimaryButton, Heading5 } from '../styled';
import { DropzoneTab } from '../scanComponent/scanComponent';
import { KText } from '../../KForm';
import QRCode from 'qrcode.react';
import { useTranslation } from 'react-i18next';
import signalRService from '../../../services/signalrService';
import notificationService from '../../../services/notificationService';
import { ProgressPopup } from '../uploadFiles/components/progressPopup.component';
import scanProvider from '../../../providers/scanProvider';
import ModalWindow from '../modalWindow';

interface OCRProcess_Help_Props {
  cardName?: string;
  type: string;
  setType: (x: string) => void;
  scanKey: string;
  t: any;
}

interface OCRProcess_Props {
  cardName?: string;
  t: any;
  type: string;
  helpType: string;
  setType: (x: string) => void;
  setHelpType: (x: string) => void;
  disabled?: boolean;
  templateName?: string;
  setResponse?: (x: any) => void;
  setIsOpen?: () => void;
  scanKey: string;
  setFieldValue?: (x: string, y: any) => void;
  onClose?: (x: string) => void;
  isOpen?: boolean;
  isAwaiting?: boolean;
  onRescan: () => void;
}

export const OCRProcess: React.FC<OCRProcess_Props> = ({
  cardName,
  t,
  setResponse,
  setFieldValue,
  setIsOpen,
  type,
  setType,
  helpType,
  templateName,
  disabled,
  setHelpType,
  scanKey,
  onClose,
  isOpen,
  isAwaiting,
  onRescan
}) => {
  const [imgStrs, setImgStrs] = useState<Array<string>>([]);
  const [pdfs, setPdfs] = useState<Array<File>>([]);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [canceller] = useState(axios.CancelToken.source());
  const [signalRConnection, setSignalRConnection] = useState<signalR.HubConnection>();

  const localTranslation = useTranslation([`scanExceptions`]);
  const lt = localTranslation.t;
  const scanTranslation = useTranslation([`scan`]);
  const st = scanTranslation.t;
  const uploadTranslation = useTranslation(['upload']);
  const ut = uploadTranslation.t;

  const menu: Array<any> = [
    {
      key: 'photo',
      content: 'photoFilled',
      text: t(`${cardName}.photo.title`),
      label: t(`${cardName}.photo.label`)
    },
    {
      key: 'upload',
      content: 'upload',
      text: t(`${cardName}.upload.title`),
      label: t(`${cardName}.upload.label`)
    },
    {
      key: 'edit',
      content: 'edit',
      text: t(`${cardName}.edit.title`),
      label: t(`${cardName}.edit.label`)
    }
  ];

  useEffect(() => {
    console.log('connecting useEffect scanKey', 105);
    if (!isAwaiting) return;
    let connection = signalRService.connect(
      `${config.ocrHubUrl}?scanKey=${scanKey}`,
      () => {},
      () => {},
      (p: string) => {
        setProgress(parseInt(p));
      },
      (scanKey: string) => {},
      (scanKey: string) => {
        setIsWaiting(true);
      }
    );
    setSignalRConnection(connection);
    return () => {
      console.log('disconnecting useEffect scanKey return', 120);
      signalRService.disconnect(connection);
    };
  }, [scanKey, isAwaiting]);

  const onCloseInternal = (key: string) => {
    onClose && onClose(key);
  };
  useEffect(() => {
    return () => {
      console.log('disconnecting', 130);
      canceller.cancel();
    };
  }, [canceller]);

  useEffect(() => {
    if (isOpen) setIsWaiting(false);
  }, [isOpen]);

  const updateDocScan = (fd: FormData) =>
    scanProvider.updateDocScan(
      fd,
      (res: any) => {
        setIsReady(true);
        if (setResponse) setResponse(res);
        if (setIsOpen) setIsOpen();
      },
      (err: any) => console.log(err),
      canceller.token
    );

  const sendToServer = () => {
    setIsWaiting(true);
    console.log('disconnecting sendToServer', 154);
    signalRService.disconnect(signalRConnection);
    console.log('connecting sendToServer', 156);
    let connection = signalRService.connect(
      `${config.ocrHubUrl}?scanKey=${scanKey}`,
      () => {
        sendToServerInternal();
      },
      (err: any) => {
        setIsWaiting(false);
        if (axios.isCancel(err)) {
          return;
        }
        alert(lt(`scanExceptions.ConnectionIssues`));
      },
      (p: string) => {
        setProgress(parseInt(p));
      },
      (scanKey: string) => {
        //cancel
      },
      (scanKey: string) => {
        //mobile opened
      }
    );
    setSignalRConnection(connection);
  };

  const sendToServerInternal = () => {
    setIsWaiting(true);
    const ocrFD = new FormData();
    if ((imgStrs && imgStrs.length > 0) || (pdfs && pdfs.length > 0)) {
      if (imgStrs && imgStrs.length > 0)
        imgStrs.forEach((scan: string, key: number) => {
          let stringImage: string = scan.replace(/^data:image\/\w+;base64,/, '');
          const file: Blob = base64toBlob(stringImage, 'image/jpeg');
          ocrFD.append(`pic-${key}`, file, `pic-${key}.jpeg`);
        });
      if (pdfs && pdfs.length > 0) pdfs.forEach((item: File) => ocrFD.append('docs[]', item));

      ocrFD.append('returnImages', '1');
      ocrFD.append('scanKey', scanKey);

      scanProvider.scanPhotosOrPDFs(
        templateName,
        ocrFD,
        (res: any) => {
          if (res.success) {
            const updateScanFD = new FormData();

            updateScanFD.append('status', '2');
            updateScanFD.append('data', JSON.stringify(res.response));
            updateScanFD.append('key', scanKey);
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
          setIsWaiting(false);
          if (axios.isCancel(err)) {
            return;
          }
          if (err && err.response && err.response.status === 401) {
            alert(lt(`scanExceptions.AuthIssues`));
          } else {
            alert(lt(`scanExceptions.ConnectionIssues`));
          }
        },
        canceller.token
      );
    }
  };
  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    acceptedFiles.forEach((item: File) => {
      if (item && item.type !== 'application/pdf') {
        var reader = new FileReader();
        reader.onload = (evt: any) => {
          setImgStrs((x: Array<string>) => x.concat(evt.target.result));
        };
        reader.readAsDataURL(item);
      } else {
        setPdfs((x: Array<File>) => [...x, item]);
      }
    });
  }, []);

  const removeImage: (x: number) => void = (x: number) => {
    setImgStrs((items: Array<string>) => items.splice(x, 1) && [...items]);
  };

  const removePdf: (x: number) => void = (x: number) => {
    setPdfs((items: Array<File>) => items.splice(x, 1) && [...items]);
  };

  return (
    <>
      <KFormRow>
        <KFormCol width={1} alignItems="center">
          <KRoundButton
            selected={type}
            disabled={disabled}
            name="mainType"
            setFieldValue={(name, value) => setType(value)}
            buttons={menu}
          />
          {disabled && (
            <Heading5
              hoverColor="blue2"
              onClick={() => {
                setImgStrs([]);
                setPdfs([]);
                setIsWaiting(false);
                setIsReady(false);
                setProgress(0);
                canceller.cancel();
                onRescan();
              }}
              color={'blue1'}
              style={{ textTransform: 'uppercase', marginLeft: 'auto' }}
            >
              {st(`common.rescan`)}
            </Heading5>
          )}
        </KFormCol>
      </KFormRow>
      {type && !disabled && (
        <KFormRow>
          <KFormCol width={2 / 12} />
          <KFormCol width={10 / 12} force>
            <SmallGeneralText>{t(`${cardName}.${type}.description`)}</SmallGeneralText>
          </KFormCol>
        </KFormRow>
      )}
      {type === 'upload' && !isReady && !disabled && (
        <>
          <KFormRow>
            <KFormCol>
              {isWaiting ? (
                <>
                  <SmallGeneralText>{t(`${cardName}.processingPhotos`)}</SmallGeneralText>
                </>
              ) : (
                <DropzoneTab
                  onDrop={onDrop}
                  imgs={imgStrs}
                  pdfs={pdfs}
                  btnText={t('sendBtnText')}
                  dragZoneText={t('dragAreaText')}
                  isIkAuszugPart
                  removePdf={removePdf}
                  remove={removeImage}
                  sendToServer={sendToServer}
                />
              )}
            </KFormCol>
          </KFormRow>
        </>
      )}
      {type === 'photo' && !disabled && (
        <OCRHelpProcess
          t={t}
          type={helpType}
          setType={(value: string) => setHelpType(value)}
          scanKey={scanKey}
          cardName={cardName}
        />
      )}
      {(type === 'upload' || type === 'photo') && isWaiting && !isReady && !disabled ? (
        <ModalWindow
          isOpen={true}
          toggle={() => undefined}
          title={ut('header.title')}
          onClose={() => onCloseInternal(scanKey)}
          subTitle={ut('header.descriptionImg', { templateName: templateName || 'PK' })}
        >
          <ProgressPopup progress={progress}></ProgressPopup>
        </ModalWindow>
      ) : null}
    </>
  );
};

const OCRHelpProcess: React.FC<OCRProcess_Help_Props> = ({ cardName, scanKey, t, type, setType }) => {
  const [email, setEmail] = useState<string>('');
  const menu: any = [
    { key: 'qrcode', content: 'qrcode', text: t(`${cardName}.qrcode.title`), label: t(`${cardName}.qrcode.label`) },
    { key: 'email', content: 'mail', text: t(`${cardName}.email.title`), label: t(`${cardName}.email.label`) },
    { key: 'manual', content: 'edit', text: t(`${cardName}.manual.title`), label: t(`${cardName}.manual.label`) }
  ];

  let childs: Array<any> = t(`${cardName}.${type}.listItems`, {
    returnObjects: true
  });

  function sendMail_scanLink(to: string, docTitle: string, link: string) {
    let fd = new FormData();
    fd.append('action', 'sendMail_scanLink');
    fd.append('to', to);
    fd.append('docTitle', docTitle);
    fd.append('link', link);

    scanProvider.sendScanLinkByMail(
      fd,
      (res: any) => {
        if (res.error) {
          alert(t(`${cardName}.email.failedReason`) + ' ' + res.error);
        } else {
          alert(t(`${cardName}.email.succeeded`));
        }
      },
      (err: any) => {
        if (axios.isCancel(err)) {
          return;
        }
        console.log(err);
        alert(t(`${cardName}.email.failedGeneral`));
      }
    );
  }

  const sendMail = () => {
    if (email && email.toString().match(/^[A-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)) {
      sendMail_scanLink(email, t(`${cardName}.email.documentTitle`), `${config.scanUrl}/${scanKey}`);
    } else {
      notificationService.showErrorMessage(t(`${cardName}.email.invalidMail`));
    }
  };

  return (
    <>
      <KFormRow>
        <KFormCol width={2 / 12} />

        <KFormCol width={10 / 12} alignItems="center">
          <KRoundButton
            selected={type}
            name="mainType"
            setFieldValue={(name, value) => setType(value)}
            buttons={menu}
          />
        </KFormCol>
      </KFormRow>
      <KFormRow>
        <KFormCol width={3 / 12} />
        <KFormCol width={9 / 12} force>
          <TextList>
            {Array.isArray(childs) &&
              childs.length > 0 &&
              childs.map((item: string, index: number) => (
                <TextListItem key={index}>
                  <TextListNumber>{index + 1}</TextListNumber> {item}
                </TextListItem>
              ))}
            {type === 'email' && (
              <>
                <TextListItem>
                  <KText
                    name="text"
                    label={t(`${cardName}.email.inputLabel`)}
                    fieldValue={email}
                    setFieldValue={(name: string, value: string) => setEmail(value)}
                  />
                </TextListItem>
                <PrimaryButton disabled={!email} style={{ margin: 0 }} height="48" onClick={sendMail}>
                  {t(`${cardName}.email.button`)}
                </PrimaryButton>
              </>
            )}
            {type === 'qrcode' && (
              <TextListItem border="true">
                <QRCode value={`${config.scanUrl}/${scanKey}`} />
              </TextListItem>
            )}
            )
            {type === 'manual' && (
              <TextListItem border="true">
                <a target="_blank" rel="noopener noreferrer" href={`${config.scanUrl}/${scanKey}`}>
                  {`${config.scanUrl}/${scanKey}`}
                </a>
              </TextListItem>
            )}
          </TextList>
        </KFormCol>
      </KFormRow>
    </>
  );
};
