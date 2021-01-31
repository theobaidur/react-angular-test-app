import React, { useState } from 'react';
import PortalComponent from '../portal';
import {
  Row,
  Col,
  Container,
  Header,
  Heading1,
  GeneralText,
  ContentWrapper,
  ActionsContainer,
  PrimaryButton,
  Content,
  PhotoSelector,
  PhotoSelectorItem,
  HeaderContent,
  CloseIcon,
  ScanAgainIcon
} from '../styled';
import SplitterLayout from 'react-splitter-layout';
import { KCheck } from '../../KForm';
import PhotoDragScaleContainer from '../photoDragScaleContainer';
import { HighlightProps } from '../pkAuszug/pkAuszug.interfaces';
import 'react-splitter-layout/lib/index.css';
import FeedbackDialog from '../feedbackDialog';
import { OcrDetectionSummary, DetectionSummary } from '../ikAuszug/components/ocrDetectionSummary.component';

interface PortalScanVerification_Props {
  isOpen: boolean;
  t: any;
  cardName: string | undefined;
  images: Array<string>;
  finish: () => void;
  onCancel?: (event: any) => void | undefined;
  onBackToScan?: (event: any) => void | undefined;
  current: number;
  setCurrent: Function;
  renderContent: React.FC<any>;
  allowAccept: boolean;
  updateDocScan?: (fd: FormData, saveCallback?: Function) => void | undefined;
  isDifferent: () => boolean;
  detectionSummary: DetectionSummary | undefined;
}

export const PortalScanVerification: React.FC<PortalScanVerification_Props> = ({
  isOpen,
  cardName,
  t,
  onCancel,
  onBackToScan,
  finish,
  renderContent,
  current,
  setCurrent,
  images,
  allowAccept,
  updateDocScan,
  isDifferent,
  detectionSummary
}) => {
  const [currentWidth, setCurrentWidth] = useState<number>(50);
  const [accepted, setAccepted] = useState<Array<number>>([]);
  const [boundaryPoly, setBoundaryPoly] = useState<HighlightProps | undefined>(undefined);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [feedbackCallback, setFeedbackCallback] = useState<Function>();
  const [isTemplateReported, setTemplateReported] = useState<boolean>(false);

  const handleBackToScan = () => {
    if (isTemplateReported) {
      if (onBackToScan) onBackToScan({});
    } else {
      setIsFeedbackOpen(true);
      setFeedbackCallback(() => {
        return (evt: any) => {
          if (onBackToScan) onBackToScan(evt);
          setIsFeedbackOpen(false);
        };
      });
    }
  };

  const handleCancel = () => {
    let wantToClose: boolean = window.confirm(t(`${cardName}.confirmText`));
    if (wantToClose) {
      if (isTemplateReported) {
        onCancel && onCancel({});
      } else {
        setIsFeedbackOpen(true);
        setFeedbackCallback(() => {
          return (evt: any) => {
            onCancel && onCancel(evt);
            setIsFeedbackOpen(false);
          };
        });
      }
    }
  };

  const handleFinish = () => {
    if (!isTemplateReported && isDifferent()) {
      setIsFeedbackOpen(true);
      setFeedbackCallback(() => {
        return (evt: any) => {
          finish && finish();
          setIsFeedbackOpen(false);
        };
      });
    } else {
      finish && finish();
    }
  };

  const feedbackSent = (score: any, description: any) => {
    setIsFeedbackOpen(false);
    if (updateDocScan) {
      const fd = new FormData();
      fd.append('feedback_score', score);
      if (description) {
        fd.append('feedback_description', description);
      }
      updateDocScan(fd, feedbackCallback);
    } else {
      if (feedbackCallback) {
        feedbackCallback();
      }
    }
  };

  const onReportTemplate = () => {
    setTemplateReported(true);
    if (updateDocScan) {
      const fd = new FormData();
      fd.append('feedback_score', '1');
      fd.append('feedback_description', 'TEMPLATE_REPORTED');
      updateDocScan(fd, () => {});
    }
  };

  return (
    <>
      <PortalComponent isOpen={isOpen} toggle={() => undefined}>
        <Row>
          <SplitterLayout
            percentage
            primaryMinSize={30}
            secondaryMinSize={30}
            onSecondaryPaneSizeChange={(res: number) => setCurrentWidth(res)}
          >
            <Col layout={4 / 9} force>
              <Container>
                <Header>
                  <HeaderContent>
                    <Heading1 noMargin color="white0" style={{ marginBottom: '10px' }}>
                      {t(`${cardName}.header`)}
                    </Heading1>

                    <GeneralText noMargin color="white0">
                      {t(`${cardName}.helpInfo`)}
                    </GeneralText>
                  </HeaderContent>
                  {onBackToScan && <ScanAgainIcon onClick={handleBackToScan} />}
                  {onCancel && <CloseIcon onClick={handleCancel} />}
                </Header>
                <OcrDetectionSummary
                  detectionSummary={detectionSummary}
                  onRestart={onBackToScan ? onBackToScan : onCancel}
                  onReportTemplate={onReportTemplate}
                ></OcrDetectionSummary>
                <ContentWrapper>{renderContent(setBoundaryPoly)}</ContentWrapper>
                <ActionsContainer>
                  <KCheck
                    name="accept"
                    itemsName={[t(`${cardName}.checkBoxText`)]}
                    itemsValue={[1]}
                    noLabel={true}
                    fieldValue={accepted}
                    disabled={!allowAccept}
                    setFieldValue={(name: string, value: any) => {
                      setAccepted(value);
                    }}
                  />
                  <PrimaryButton
                    main
                    disabled={accepted && accepted.indexOf(1) === -1}
                    onClick={handleFinish}
                    style={{ margin: '0', marginRight: '30px' }}
                  >
                    {t(`${cardName}.dataTransferBtn`)}
                  </PrimaryButton>
                </ActionsContainer>
              </Container>
            </Col>
            <Col layout={5 / 9} force style={{ height: 'calc(100vh - 40px)' }}>
              <Container>
                <ContentWrapper>
                  <Content style={{ padding: 0 }}>
                    {images &&
                      images.map(
                        (image: string, index: number) =>
                          index === current && (
                            <PhotoDragScaleContainer
                              key={index}
                              currentWidth={currentWidth}
                              image={image}
                              boundingPoly={boundaryPoly}
                            />
                          )
                      )}
                  </Content>
                  {images && images.length > 1 && (
                    <ActionsContainer>
                      <PhotoSelector>
                        {images.map((item: string, index: number) => (
                          <PhotoSelectorItem
                            key={index}
                            className={current === index ? 'active' : ''}
                            onClick={() => {
                              setCurrent(index);
                              setBoundaryPoly(undefined);
                            }}
                          >
                            {index + 1}
                          </PhotoSelectorItem>
                        ))}
                      </PhotoSelector>
                    </ActionsContainer>
                  )}
                </ContentWrapper>
              </Container>
            </Col>
          </SplitterLayout>
        </Row>
      </PortalComponent>
      <FeedbackDialog isOpen={isFeedbackOpen} feedbackCallback={feedbackCallback} onApprove={feedbackSent} t={t} />
    </>
  );
};
