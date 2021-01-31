import React, { useState } from 'react';

import { Child, ExConnection } from '../../../redux/types';
import { KFormCard, KRadio, KSelect, KText, KDatePicker, KAutosuggestText } from '../../../components/KForm';
import { KFormRow, KFormCol, KFormSection } from '../../../components/KForm/KForm_styles';
import { Card_Props, ProgressResult_Props } from '../../module.interfaces';
import { Heading4, CardQuestion } from '../../../components/common/styled';
import KFieldArray from '../../../components/KForm/KFieldArray';
import useCardValidation from '../../../utils/useCardValidation';
import { getLastNames } from '../../../utils/collectors';
import { useStore } from 'react-redux';

class CardChildrenEx {
  constructor() {
    this.name = '';
    this.card = CardComponent;
    this.validate = (legalData: any) => {
      let result: ProgressResult_Props = { done: false, invalid: 0, total: 0 };
      if (!legalData) return result;
      result.total = 1;
      if (legalData.hasEx && legalData.hasEx.length > 0) {
        if (legalData.hasEx[0] === 1) {
          if (legalData.exes && legalData.exes.length > 0) {
            legalData.exes.forEach((ex: any) => {
              result.total++;
              if (ex.mode) {
                if (ex.mode[0] && ex.mode[0] === 3) {
                  result.total += 2;
                  if (!ex.gender || !ex.gender[0]) result.invalid++;
                  if (!ex.birthDate) result.invalid++;
                } else if (ex.mode[0] && ex.mode[0] !== 4) {
                  result.total += 4;
                  if (!ex.modeStart) result.invalid++;
                  if (!ex.modeEnd) result.invalid++;
                  if (!ex.gender || !ex.gender[0]) result.invalid++;
                  if (!ex.birthDate) result.invalid++;
                }
              } else {
                result.invalid++;
              }

              if (ex.children && ex.children.length > 0) {
                ex.children.forEach((child: any) => {
                  result.total += 3;
                  if (!child.firstName || child.firstName === '') result.invalid++;
                  if (!child.lastName || child.lastName === '' || (child.lastName && !child.lastName.length) ) result.invalid++;
                  if (!child.gender || !child.gender[0]) result.invalid++;
                  if (!child.birthDate || child.birthDate === '') result.invalid++;
                });
              }
            });
          } else {
            result.invalid++;
          }
        } else if (legalData.hasEx[0] === 2) {
          legalData.exes = [];
        }
      } else {
        result.invalid++;
      }
      result.done = result.invalid === 0;
      return result;
    };
  }
  name: string;
  card: React.FC<Card_Props>;
  validate: (legalData: any) => ProgressResult_Props;
}

export default CardChildrenEx;

const CardComponent: React.FC<Card_Props> = (props: Card_Props) => {
  const { legalData, cardName, t } = props;
  const [exes, setExes] = useState<any[]>((legalData && legalData.exes) || []);

  const state = useStore().getState();

  const manipulateExes = (name: string, array: any[]) => {
    const newExCons: ExConnection[] = [];
    array.forEach((exCon: any) => {
      const newExCon = { ...(exCon as ExConnection) };
      const newChildren: Child[] = [];
      exCon.children &&
        exCon.children.forEach((child: any) => {
          const newChild = { ...(child as Child) };
          newChildren.push(newChild);
        });
      newExCon.children = [...newChildren];
      newExCons.push(newExCon);
    });
    props.setFieldValue && props.setFieldValue('exes', newExCons);
    setExes([...array]);
  };

  const lastNames : string[] = getLastNames(state);
  useCardValidation(props);

  return (
    <>
      {legalData ? (
        <KFormCard
          id={props.id}
          cardName={cardName}
          cardNumber={props.cardNumber}
          state={props.isCardValid}
          disabled={props.disabled}
          handleApprove={props.handleApprove}
          toggleHelp={props.toggleHelp}
          position={props.position}
          closedText={
            t(`${cardName}.closedText`) + `: ` + (legalData.hasEx && t(`${cardName}.answers.${legalData.hasEx[0] - 1}`))
          }
        >
          <KFormSection>
            <KFormRow>
              <KFormCol width={1}>
                <Heading4>{t(`${cardName}.title`)}</Heading4>
              </KFormCol>
            </KFormRow>
            <KFormRow>
              <KFormCol width={1}>
                <KRadio
                  name={'hasEx'}
                  label={t(`${cardName}.question`)}
                  itemsName={[0, 1].map((e) => {
                    return t(`${cardName}.answers.${e}`);
                  })}
                  itemsValue={[1, 2]}
                  fieldValue={legalData.hasEx}
                  setFieldValue={props.setFieldValue}
                />
              </KFormCol>
            </KFormRow>
          </KFormSection>
          {legalData.hasEx && legalData.hasEx[0] === 1 ? (
            <KFormSection>
              <KFieldArray
                name={'exes'}
                label={t(`${cardName}.exes`)}
                addText={t(`${cardName}.addExes`)}
                setFieldValue={manipulateExes}
                fieldValue={exes}
                t={t}
                cardName={cardName}
              >
                <KFormRow>
                  <KFormCol width={1} force={true}>
                    <KSelect
                      name={'mode'}
                      label={t(`${cardName}.mode`)}
                      itemsName={[0, 1, 2, 3].map((e) => {
                        return t(`${cardName}.modeItems.${e}`);
                      })}
                      itemsValue={[1, 2, 3, 4]}
                    />
                  </KFormCol>
                </KFormRow>
                <KFormRow
                  conditionName={'mode'}
                  conditionValues={[[3, 4]]}
                  conditionReverse
                  conditionLabels={{ modeStart: 'mode', modeEnd: 'mode' }}
                >
                  <KFormCol width={1} force={true}>
                    <KDatePicker name={'modeStart'} label={t(`${cardName}.modeStart`)} />
                  </KFormCol>
                  <KFormCol width={1} force={true}>
                    <KDatePicker name={'modeEnd'} label={t(`${cardName}.modeEnd`)} />
                  </KFormCol>
                </KFormRow>
                <KFormRow>
                  <CardQuestion>{t(`${cardName}.exData`)}</CardQuestion>
                </KFormRow>
                <KFormRow>
                  <KFormCol width={1} force={true}>
                    <KDatePicker name={'birthDate'} label={t(`general.birthDate`)} />
                  </KFormCol>
                  <KFormCol width={1} force={true}>
                    <KSelect
                      name={'gender'}
                      label={t(`general.gender`)}
                      itemsName={[0, 1, 2].map((e) => {
                        return t(`general.genderItems.${e}`);
                      })}
                      itemsValue={[1, 2, 3]}
                    />
                  </KFormCol>
                </KFormRow>
                <KFormRow>
                  <KFormCol width={1} force={true}>
                    <KFieldArray
                      name={'children'}
                      label={t(`general.children`)}
                      addText={t(`general.addChildren`)}
                      startEmpty
                    >
                      <KFormRow>
                        <KFormCol width={1} force={true}>
                          <KText name={'firstName'} label={t(`general.firstName`)} />
                        </KFormCol>
                        <KFormCol width={1 / 2} force={true}>
                          <KAutosuggestText
                            name={'lastName'}
                            label={t(`general.lastName`)}
                            items={lastNames}
                          />
                        </KFormCol>
                      </KFormRow>
                      <KFormRow>
                        <KFormCol width={1} force={true}>
                          <KDatePicker name={'birthDate'} label={t(`general.birthDate`)} />
                        </KFormCol>
                        <KFormCol width={1} force={true}>
                          <KSelect
                            name={'gender'}
                            label={t(`general.gender`)}
                            itemsName={[0, 1, 2].map((e) => {
                              return t(`general.genderItems.${e}`);
                            })}
                            itemsValue={[1, 2, 3]}
                          />
                        </KFormCol>
                      </KFormRow>
                    </KFieldArray>
                  </KFormCol>
                </KFormRow>
              </KFieldArray>
            </KFormSection>
          ) : (
            ''
          )}
        </KFormCard>
      ) : (
        ''
      )}
    </>
  );
};
