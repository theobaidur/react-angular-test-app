import React, { useEffect } from 'react';
import { Row, Col, Icon } from '../../../components/common/styled';
import { useTranslation } from 'react-i18next';
import { useStore } from 'react-redux';
import { ViewHolder, ViewHeading } from '../../module.styled';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useMemoizedCallback } from '../../../utils/customCallbackHook';

const ViewPensionWork: React.FC<{ result: any }> = ({ result }) => {
  const { t } = useTranslation('module_pensionWork');
  const state = useStore().getState();

  let sliderRef: React.RefObject<Slider> = React.createRef();
  let sliderRefP: React.RefObject<Slider> = React.createRef();

  const [sliderIndex, setSliderIndex] = React.useState<number>();
  const [sliderIndexP, setSliderIndexP] = React.useState<number>();

  const setSlidersIndexesInternal = useMemoizedCallback(() => {
    if (result && result.self && result.self.pension && result.self.pension.length > 0) {
      let newIndex = Math.max(0, result.self.pension.length - 3);
      sliderRef.current && sliderRef.current.slickGoTo(newIndex, false);
      setSliderIndex(newIndex);
    }
    if (result && result.partner && result.partner.pension && result.partner.pension.length > 0) {
      let newIndexP = Math.max(0, result.partner.pension.length - 3);
      sliderRefP.current && sliderRefP.current.slickGoTo(newIndexP, false);
      setSliderIndexP(newIndexP);
    }
  }, [result, setSliderIndex, setSliderIndexP, sliderRef, sliderRefP]);

  useEffect(() => {
    setSlidersIndexesInternal();
  }, [result, setSlidersIndexesInternal]);

  return (
    <>
      <Row noMargin>
        <Col layout={0.5} className={state.myPartner.active ? 'padding-left' : ''}>
          <ViewHolder partner={state.myPartner.active} width="50">
            {result && result.self && result.self.pension && result.self.pension.length > 0 ? (
              <Row>
                <Col layout={0.05} style={{ padding: 'unset' }}></Col>
                <Col layout={0.1} center force>
                  <Icon
                    style={{
                      padding: 0,
                      margin: 0,
                      visibility: sliderIndex === 0 || result.self.pension.length <= 3 ? 'hidden' : 'unset'
                    }}
                    size="32"
                    content="leftBig"
                    onClick={() => {
                      sliderRef.current && sliderRef.current.slickPrev();
                    }}
                  />
                </Col>
                <Col layout={0.7}>
                  <Slider
                    dots={false}
                    infinite={false}
                    slidesToShow={3}
                    slidesToScroll={3}
                    initialSlide={Math.max(0, result.self.pension.length - 3)}
                    arrows={false}
                    speed={250}
                    ref={sliderRef}
                    afterChange={setSliderIndex as any}
                  >
                    {result.self.pension
                      .slice()
                      .filter((p: any) => p && !isNaN(p.pensionage) && !isNaN(p.month))
                      .sort((a: any, b: any) => (a.pensionage > b.pensionage ? 1 : -1))
                      .map((p: any, i: number) => (
                        <React.Fragment key={i}>
                          <ViewHeading type={2}>{p.pensionage}</ViewHeading>
                          <ViewHeading size={'26'} type={2} lined>
                            {' '}
                            {p.month}{' '}
                          </ViewHeading>
                        </React.Fragment>
                      ))}
                  </Slider>
                </Col>
                <Col layout={0.1} center force>
                  <Icon
                    style={{
                      padding: 0,
                      margin: 0,
                      visibility:
                        (sliderIndex !== undefined && sliderIndex >= result.self.pension.length - 3) ||
                        sliderIndex === undefined ||
                        result.self.pension.length <= 3
                          ? 'hidden'
                          : 'unset'
                    }}
                    size="32"
                    content="rightBig"
                    onClick={() => {
                      sliderRef.current && sliderRef.current.slickNext();
                    }}
                  />
                </Col>
                <Col layout={0.05} style={{ padding: 'unset' }}></Col>
              </Row>
            ) : (
              <Row>
                <Col>
                  <ViewHeading type={2}> {t(`view.secondPillarTitle`)} </ViewHeading>
                  <ViewHeading size={'26'} type={2} lined>
                    {' '}
                    {'?'}{' '}
                  </ViewHeading>
                </Col>
              </Row>
            )}
          </ViewHolder>
        </Col>
        {state.myPartner.active ? (
          <Col layout={0.5} className="padding-right">
            <ViewHolder partner={state.myPartner.active}>
              {result && result.partner && result.partner.pension && result.partner.pension.length > 0 ? (
                <Row>
                  <Col layout={0.05} style={{ padding: 'unset' }}></Col>
                  <Col layout={0.1} center force>
                    <Icon
                      style={{
                        padding: 0,
                        margin: 0,
                        visibility: sliderIndexP === 0 || result.partner.pension.length <= 3 ? 'hidden' : 'unset'
                      }}
                      size="32"
                      content="leftBig"
                      onClick={() => {
                        sliderRefP.current && sliderRefP.current.slickPrev();
                      }}
                    />
                  </Col>
                  <Col layout={0.7}>
                    <Slider
                      dots={false}
                      infinite={false}
                      slidesToShow={3}
                      slidesToScroll={3}
                      initialSlide={Math.max(0, result.partner.pension.length - 3)}
                      arrows={false}
                      speed={250}
                      ref={sliderRefP}
                      afterChange={setSliderIndexP}
                    >
                      {result.partner.pension
                        .slice()
                        .filter((p: any) => p && !isNaN(p.pensionage) && !isNaN(p.month))
                        .sort((a: any, b: any) => (a.pensionage > b.pensionage ? 1 : -1))
                        .map((p: any, i: number) => (
                          <React.Fragment key={i}>
                            <ViewHeading type={2}>{p.pensionage}</ViewHeading>
                            <ViewHeading size={'26'} type={2} lined>
                              {' '}
                              {p.month}{' '}
                            </ViewHeading>
                          </React.Fragment>
                        ))}
                    </Slider>
                  </Col>
                  <Col layout={0.1} center force>
                    <Icon
                      style={{
                        padding: 0,
                        margin: 0,
                        visibility:
                          (sliderIndexP !== undefined && sliderIndexP >= result.partner.pension.length - 3) ||
                          sliderIndexP === undefined ||
                          result.partner.pension.length <= 3
                            ? 'hidden'
                            : 'unset'
                      }}
                      size="32"
                      content="rightBig"
                      onClick={() => {
                        sliderRefP.current && sliderRefP.current.slickNext();
                      }}
                    />
                  </Col>
                  <Col layout={0.05} style={{ padding: 'unset' }}></Col>
                </Row>
              ) : (
                <Row>
                  <Col>
                    <ViewHeading type={2}> {t(`view.secondPillarTitle`)} </ViewHeading>
                    <ViewHeading size={'26'} type={2} lined>
                      {' '}
                      {'?'}{' '}
                    </ViewHeading>
                  </Col>
                </Row>
              )}
            </ViewHolder>
          </Col>
        ) : (
          ''
        )}
      </Row>
    </>
  );
};

export default ViewPensionWork;
