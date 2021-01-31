import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  ScanComponentWrapper,
  ScanContent,
  ScanContentWrapper,
  DropzoneWrapper,
  ImportedImg,
  ImgContainer,
  ImagesWrapper,
  ScanFooter,
  OverflowContent,
  Counter,
  ExamplePicture,
  List,
  ListItem,
  Toolbar,
  BigIcon,
  ImgWithLabelContainer,
  Filename
} from './scanComponent.styled';
import DropZone from '../dropZone';
import {
  GeneralText,
  Col,
  Row,
  SmallGeneralText,
  PrimaryButton,
  Heading1,
  Heading3,
  ProgressContainer
} from '../styled';
import { scanSteps } from '../../../constants/enums';
import { IDocScan } from './Scan.interfaces';
import { useCheckerCode } from './hooks';
import base64toBlob from '../../../utils/base64toBlob';
import { config } from '../../../config';
import monetoIcon from '../../../assets/images/moneto-logo.svg';
import pkExample from '../../../assets/images/pk_example.jpg';
import ikExample from '../../../assets/images/ik_example.jpg';
import { useTranslation, Trans } from 'react-i18next';
import { ImageViewer } from '../imageViewer';
import signalRService from '../../../services/signalrService';
import { LinearProgress } from '@material-ui/core';
import { ProcessStepsWrapper } from '../ocrProcess/components/processStepsWrapper.comonent';
import scanProvider from '../../../providers/scanProvider';
import axios from 'axios';
import { useMemoizedCallback } from '../../../utils/customCallbackHook';

const format = 'image/jpeg';
const extension = format.split('/')[1];

interface ScanPageProps {
  match: { params: any };
  history: any;
}

const ScanPage: React.FC<ScanPageProps> = ({ match, history }) => {
  const [imgs, setImgs] = useState<Array<string>>([]);
  const inputRef: any = useRef<HTMLInputElement>(null);
  const isUnique: IDocScan = useCheckerCode(match.params.key);

  const [step, setStep] = useState(scanSteps.INVALID_CODE_STEP);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [progressbar, setProgressbar] = useState<number>(0);
  const [progressReady, setProgressReady] = useState<boolean>(false);
  const [canceller] = useState(axios.CancelToken.source());
  const [signalRConnection, setSignalRConnection] = useState<signalR.HubConnection>();

  const { t } = useTranslation(['scan']);
  const localTranslation = useTranslation([`scanExceptions`]);
  const lt = localTranslation.t;

  const onProcessingRemotelyCanceled = useMemoizedCallback(() => {
    //isUnique.success = false;
    setStep(scanSteps.INVALID_CODE_STEP);
    canceller.cancel();
    console.log('disconnect onProcessingRemotelyCanceled');
    signalRService.disconnect(signalRConnection);
  }, [canceller, signalRConnection]);

  useEffect(() => setStep(isUnique.success ? scanSteps.PREVIEW_STEP : scanSteps.INVALID_CODE_STEP), [isUnique.success]);

  useEffect(() => {
    const timeout = (time: number) =>
      setTimeout(() => {
        setCurrentStep((currentStep: number) => {
          let newCurrentStep = currentStep + 1 < 3 ? currentStep + 1 : 0;
          timeout(newCurrentStep === 2 ? 20000 : 10000);
          return newCurrentStep;
        });
      }, time);

    if (inputRef && inputRef.current && step === scanSteps.SCAN_STEP) inputRef.current.click();
    if (step === scanSteps.PROCCESSING_STEP) timeout(10000);
  }, [step]);

  const sendItemsToServer: () => void = () => {
    if (imgs.length > 0) uploadImagesToServer(match.params.key, setStep, setImgs, imgs, isUnique.docType);
    else alert(t('stepper.addImageFirst'));
  };

  useEffect(() => {
    console.log('connect useEffect');
    let connection = signalRService.connect(
      `${config.ocrHubUrl}?scanKey=${match.params.key}`,
      () => {
        connection && connection.send('ocrScanPageOpen');
      },
      () => {},
      () => {},
      () => {
        onProcessingRemotelyCanceled();
      }
    );
    setSignalRConnection(connection);
  }, [match.params.key, onProcessingRemotelyCanceled]);

  const uploadImagesToServer: Function = (
    key: string,
    setStep: Function,
    setListScans: Function,
    listScans: Array<string>,
    templateName: string | undefined
  ) => {
    setStep(scanSteps.PROCCESSING_STEP);

    const fd = new FormData();
    if (listScans && listScans.length > 0)
      listScans.forEach((scan: string, key: number) => {
        let stringImage: string = scan.replace(/^data:image\/\w+;base64,/, '');
        const file: Blob = base64toBlob(stringImage, format);
        fd.append(`pic-${key}`, file, `pic-${key}.${extension}`);
      });

    fd.append('returnImages', '1');
    fd.append('scanKey', key);

    //console.log('disconnect uploadImagesToServer');
    //signalRService.disconnect(signalRConnection);
    console.log('connect uploadImagesToServer');
    let connection = signalRService.connect(
      `${config.ocrHubUrl}?scanKey=${key}`,
      () => {
        scanProvider.scanPhotosOrPDFs(
          templateName,
          fd,
          (res: any) => {
            if (res.success) {
              updateDocumentScans(key, setStep, setListScans, res.response);
            } else {
              alert(lt(`scanExceptions.${res.error.code}`, { values: res.error.values }));
              setStep(scanSteps.SCAN_STEP);
            }
          },
          (err: any) => {
            if (axios.isCancel(err)) {
              return;
            }
            if (err && err.response && err.response.status === 401) {
              alert(lt(`scanExceptions.AuthIssues`));
              isUnique.success = false;
              setStep(scanSteps.INVALID_CODE_STEP);
            } else {
              alert(lt(`scanExceptions.ConnectionIssues`));
              setStep(scanSteps.SCAN_STEP);
            }
            //setListScans([]);
          },
          canceller.token
        );
      },
      (err: any) => {
        if (axios.isCancel(err)) {
          return;
        }
        alert(lt(`scanExceptions.ConnectionIssues`));
        setStep(scanSteps.SCAN_STEP);
      },
      (p: string) => {
        setProgress(parseInt(p));
      },
      (scanKey: string) => {
        onProcessingRemotelyCanceled();
      },
      (scanKey: string) => {}
    );
    setSignalRConnection(connection);
  };

  const updateDocumentScans: Function = (
    key: string,
    setStep: Function,
    setListScans: Function,
    scanResponse: { Images: string; list: string; listWithVertex: string }
  ) => {
    const updateDocScan = (fd: FormData) =>
      scanProvider.updateDocScan(
        fd,
        (result: any) => {
          if (result.success) {
            setStep(scanSteps.COMPLETE_STEP);
          } else {
            const error = new Error('Results were not saved: ' + result.errorText ? result.errorText : result.error);
            alert(error.message);
            setStep(scanSteps.SCAN_STEP);
          }
        },
        (e: string) => {
          if (axios.isCancel(e)) {
            return;
          }
          console.log('error: ', e);
          alert(e);
          setListScans([]);
          setStep(scanSteps.SCAN_STEP);
        },
        canceller.token
      );

    let images: Array<string> = JSON.parse(scanResponse.Images);
    scanResponse.Images = '';
    const updateScanFD = new FormData();
    updateScanFD.append('status', '2');
    updateScanFD.append('data', JSON.stringify(scanResponse));
    updateScanFD.append('key', key);
    updateScanFD.append('action', 'updateDocScan');

    images &&
      images.length > 0 &&
      images.forEach((scan: string, key: number) => {
        updateScanFD.append(`images[]`, `data:image/jpeg;base64,${scan}`);
      });

    updateDocScan(updateScanFD);
  };

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((item: File) => {
      if (item && item.type !== 'application/pdf') {
        var reader = new FileReader();
        reader.onload = (evt: any) => {
          setImgs((x: Array<string>) => x.concat(evt.target.result));
        };
        reader.readAsDataURL(item);
      }
    });
  }, []);

  const removeImage: (x: number) => void = (x: number) => {
    setImgs((items: Array<string>) => items.splice(x, 1) && [...items]);
  };

  return (
    <ScanComponentWrapper>
      {!isUnique.progress && (
        <OverflowContent
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(var(--vh,1vh) * 100)',
            justifyContent: 'space-between'
          }}
        >
          {isUnique.success ? (
            (step === scanSteps.PREVIEW_STEP && (
              <BaseLayout
                title={t('stepper.tipps')}
                t={t}
                exampleImg={isUnique.docType === 'IK' ? ikExample : pkExample}
                docType={isUnique.docType}
                renderContent={(props: any) => PreviewStep({ ...props, docType: isUnique.docType || '' } as any)}
              />
            )) ||
            (step === scanSteps.SCAN_STEP && (
              <BaseLayout
                title={t('stepper.photos')}
                onDrop={onDrop}
                inputRef={inputRef}
                t={t}
                imgs={imgs}
                removeImage={removeImage}
                renderContent={ScanStep}
              />
            )) ||
            (step === scanSteps.PROCCESSING_STEP && (
              <>
                <BaseLayout
                  title={t('stepper.processing')}
                  imgs={imgs}
                  generalText={
                    [t('stepper.processingText'), t('stepper.searchingText'), t('stepper.waitingText')][currentStep]
                  }
                  iconClass={['spinner', 'searching', 'waiting'][currentStep]}
                  progress={progress}
                  progressbar={progressbar}
                  updateProgressbar={setProgressbar}
                  updateReady={setProgressReady}
                  progressReady={progressReady}
                  renderContent={StepWithIcon}
                  t={t}
                />
              </>
            )) ||
            (step === scanSteps.COMPLETE_STEP && (
              <BaseLayout
                title={t('stepper.complete')}
                generalText={t('stepper.completeText')}
                iconClass="complete"
                renderContent={StepWithIcon}
              />
            )) ||
            (step === scanSteps.INVALID_CODE_STEP && (
              <BaseLayout
                title={t('stepper.invalid')}
                generalText={t('stepper.invalidText')}
                iconClass="error"
                renderContent={StepWithIcon}
              />
            ))
          ) : (
            <BaseLayout
              title={t('stepper.invalid')}
              generalText={t('stepper.invalidText')}
              iconClass="error"
              renderContent={StepWithIcon}
            />
          )}

          {step === scanSteps.PREVIEW_STEP && (
            <PrimaryButton
              onClick={() => setStep(scanSteps.SCAN_STEP)}
              height="48"
              style={{ margin: '0 auto 15px', width: 'calc(100% - 20px)', minHeight: '48px', transition: 'unset' }}
            >
              {t('stepper.understandBtn')}
            </PrimaryButton>
          )}

          {step === scanSteps.SCAN_STEP && (
            <div>
              <PrimaryButton
                height="48"
                onClick={() => {
                  inputRef.current.click();
                }}
                style={{ margin: '0 auto 15px', width: 'calc(100% - 20px)', transition: 'unset' }}
              >
                {imgs && imgs.length > 0 ? t('stepper.oneMorePageBtn') : t('stepper.startPhotoBtn')}
              </PrimaryButton>
              <PrimaryButton
                onClick={sendItemsToServer}
                height="48"
                outlined
                style={{ margin: '0 auto 15px', width: 'calc(100% - 20px)', transition: 'unset' }}
              >
                {t('stepper.sendToServerBtn')}
              </PrimaryButton>
            </div>
          )}
        </OverflowContent>
      )}
    </ScanComponentWrapper>
  );
};

export default ScanPage;

interface PreviewCompleteStepProps {
  exampleImg: string;
  t: any;
  docType: string;
}

export const PreviewStep: React.FC<PreviewCompleteStepProps> = ({ exampleImg, t, docType }) => {
  console.log('docType', docType);
  return (
    <>
      <Col>
        <ExamplePicture src={exampleImg} />
      </Col>
      <Col>
        <List>
          {t(`stepper.previewStep.${docType || 'default'}`, { returnObjects: true }).map(
            (item: string, index: number) => (
              <ListItem>
                <Counter>{index + 1}</Counter>
                <SmallGeneralText noMargin>{item}</SmallGeneralText>
              </ListItem>
            )
          )}
        </List>
      </Col>
    </>
  );
};
interface StepProps {
  generalText: string;
  iconClass: string;
  progress?: number;
  updateProgressbar?: (relativeProgress: number) => void;
  updateReady?: (isready: boolean) => void;
  progressReady?: boolean;
  progressbar?: number;
  t?: any;
}
export const StepWithIcon: React.FC<StepProps> = ({
  generalText,
  iconClass,
  progress,
  updateProgressbar,
  updateReady,
  progressReady,
  progressbar,
  t
}) => (
  <>
    <Col center style={{ padding: '20px 40px 0' }}>
      <GeneralText noMargin>
        <Trans>{generalText}</Trans>
      </GeneralText>
    </Col>
    <Col center>
      <BigIcon className={iconClass} />
    </Col>
    {progress !== undefined && progress >= 0 && (
      <>
        <Col center>
          <ProcessStepsWrapper
            progress={progress}
            updateProgressbar={updateProgressbar ? updateProgressbar : () => {}}
            updateReady={updateReady ? updateReady : () => {}}
          ></ProcessStepsWrapper>
        </Col>
        <Col center style={{ visibility: progressReady ? 'visible' : 'hidden' }}>
          <GeneralText noMargin color={'blue1'} style={{ position: 'relative', top: '10px' }}>
            {t('progress.ready')}
          </GeneralText>
        </Col>
        <ProgressContainer
          isAlwaysVisible
          disableAnimation={progressbar !== undefined && progressbar === 0 && progress !== 0}
          style={{ width: '100%', height: '10px', position: 'unset', top: 'unset' }}
        >
          {!progressReady && progress !== 0 ? (
            <LinearProgress
              style={{
                position: 'relative',
                top: '20px',
                height: '10px',
                opacity: 1
              }}
              value={progressbar ? progressbar : 0}
              variant={'determinate'}
            ></LinearProgress>
          ) : (
            <div>
              <LinearProgress
                style={{
                  position: 'relative',
                  top: '20px',
                  height: '10px',
                  opacity: 0.5
                }}
                value={progressbar ? progressbar : 0}
                variant={'indeterminate'}
              ></LinearProgress>
            </div>
          )}
        </ProgressContainer>
      </>
    )}
  </>
);

interface ScanStepProps {
  onDrop: Function;
  inputRef: any;
  onClose: Function;
  imgs: Array<string>;
  removeImage: (x: number) => void;
}

export const ScanStep: React.FC<ScanStepProps> = ({ onDrop, inputRef, imgs, removeImage, ...props }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<number>(-1);
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        style={{ display: 'none' }}
        accept="image/*"
        multiple
        capture
        onChange={() =>
          onDrop(inputRef && inputRef.current && inputRef.current.files ? Array(...inputRef.current.files) : [])
        }
      />
      <UploadedImages
        {...props}
        list={imgs}
        open={(index: number) => {
          setVisible(true);
          setCurrent(index);
        }}
        removeImg={removeImage}
      />
      <ImageViewer
        isOpen={visible}
        onClose={() => {
          setCurrent(-1);
          setVisible(false);
        }}
        src={current > -1 ? imgs[current] : ''}
      />
    </>
  );
};

const BaseLayout: React.FC<any> = ({ renderContent, title, ...props }) => {
  return (
    <ScanContentWrapper style={{ height: 'unset' }}>
      <ScanContent>
        <Row noMargin>
          <Col center style={{ justifyContent: 'space-between' }}>
            <Heading1 size={20} noMargin>
              {title}
            </Heading1>
            <img src={monetoIcon} alt="" />
          </Col>
          {renderContent(props)}
        </Row>
      </ScanContent>
    </ScanContentWrapper>
  );
};

interface DropzoneTabProps {
  imgs: Array<string>;
  sendToServer: () => void;
  onDrop: (files: Array<File>) => void;
  remove: (x: number) => void;
  pdfs: Array<File>;
  title?: string;
  btnText: string;
  dragZoneText: string;
  accept?: string;
  generalText?: string;
  removePdf: (x: number) => void;
  t?: any;
  isIkAuszugPart?: boolean;
}
export const DropzoneTab: React.FC<DropzoneTabProps> = ({
  imgs,
  removePdf,
  pdfs,
  sendToServer,
  onDrop,
  remove,
  title,
  t,
  generalText,
  dragZoneText,
  btnText,
  accept,
  isIkAuszugPart
}) => {
  return (
    <ScanContentWrapper isIkAuszugPart={isIkAuszugPart ? 'yes' : 'no'}>
      <ScanContent>
        <DropzoneWrapper>
          {title && <Heading3 noMargin>{title}</Heading3>}
          {generalText && <GeneralText>{generalText}</GeneralText>}
          <UploadedImages t={t} list={imgs} removeImg={remove} pdfs={pdfs} removePdf={removePdf} />
          <DropZone accept={accept || 'image/*,application/pdf'} text={dragZoneText} multiple onDrop={onDrop} />
        </DropzoneWrapper>
      </ScanContent>{' '}
      <ScanFooter>
        <PrimaryButton
          disabled={!((imgs && imgs.length > 0) || (pdfs && pdfs.length > 0))}
          style={{ margin: 0 }}
          height="48"
          onClick={sendToServer}
        >
          {btnText}
        </PrimaryButton>
      </ScanFooter>
    </ScanContentWrapper>
  );
};

interface IUpload {
  list: Array<string>;
  removeImg?: (x: number) => void;
  pdfs?: Array<File>;
  t?: any;
  removePdf?: (x: number) => void;
  open?: (x: number) => void;
}

export const UploadedImages: React.FC<IUpload> = ({ list, open, removeImg, pdfs, t, removePdf }) => {
  return (
    <ImagesWrapper>
      {list &&
        list.length > 0 &&
        list.map((img: string, key: number) => (
          <ImgWithLabelContainer key={key}>
            <span>
              {t && t('stepper.pageName')} {key + 1}:{' '}
            </span>
            <ImgContainer key={key}>
              <ImportedImg src={img} />
              {removeImg && (
                <Toolbar>
                  <i className="zoom" onClick={() => open && open(key)} />
                  <i className="seperator" />
                  <i className="remove" onClick={() => removeImg(key)} />
                </Toolbar>
              )}
            </ImgContainer>
          </ImgWithLabelContainer>
        ))}
      {pdfs &&
        pdfs.length > 0 &&
        pdfs.map((item: File, key: number) => (
          <ImgWithLabelContainer key={key}>
            <Filename>{item.name}</Filename>
            <ImgContainer key={key}>
              <ImportedImg src="https://www.elegantthemes.com/blog/wp-content/uploads/2016/09/wordpress-pdf-icon.png" />
              {removePdf && (
                <Toolbar>
                  <i className="remove" onClick={() => removePdf(key)} />
                </Toolbar>
              )}
            </ImgContainer>
          </ImgWithLabelContainer>
        ))}
    </ImagesWrapper>
  );
};
