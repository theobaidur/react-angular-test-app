import React, { useEffect, useState } from 'react';

import { Child } from '../../../redux/types';
import { KFormCard, KRadio, KSelect, KText, KDatePicker, KAutosuggestText } from '../../../components/KForm';
import { KFormRow, KFormCol, KFormSection } from '../../../components/KForm/KForm_styles';
import { Card_Props, ProgressResult_Props } from './../../module.interfaces';
import { Heading4, CardHeading } from '../../../components/common/styled';
import { useStore } from 'react-redux';
import KFieldArray from '../../../components/KForm/KFieldArray';
import { getLastNames } from '../../../utils/collectors';

class CardChildrenBase {
  constructor() {
    this.name = '';
    this.card = CardComponent;
    this.validate = (legalData: any) => {
      let result: ProgressResult_Props = { done: false, invalid: 0, total: 0 };
      if (!legalData) return result;
      result.total = 1;
      if (legalData.haveChildren) {
        if (legalData.haveChildren.length < 1) result.invalid++;

        if (legalData.haveChildren[0] === 1) {
          if (legalData.children && legalData.children.length > 0) {
            legalData.children.forEach((child: any) => {
              result.total += 3;
              if (!child.firstName || child.firstName === '') result.invalid++;
              if (!child.lastName || child.lastName === '' || (child.lastName && !child.lastName.length) ) result.invalid++;
              if (!child.gender || !child.gender[0]) result.invalid++;
              if (!child.birthDate || child.birthDate === '') result.invalid++;
            });
          }
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

export default CardChildrenBase;

const CardComponent: React.FC<Card_Props> = (props: Card_Props) => {
  const { legalData, cardName, t, validateCard, id } = props;
  const [children, setChildren] = useState<any[]>((legalData && legalData.children) || []);
  const state = useStore().getState();

  const manipulateChildren = (name: string, array: any[]) => {
    const newChildren: Child[] = [];
    array.forEach((child: any) => {
      const newChild: Child = { ...(child as Child) };
      newChildren.push(newChild);
    });
    props.setFieldValue && props.setFieldValue('children', newChildren);
    setChildren([...array]);
  };

  const person = state.myPerson;
  const myFullName = person && person.fullName ? person.fullName() : '';

  const partner = state.myPartner;
  const partnerFullName = partner && partner.fullName ? partner.fullName() : '';

  const lastNames : string[] = getLastNames(state);

  const fullNames =
    myFullName === '' || partnerFullName === ''
      ? `${myFullName}${partnerFullName}`
      : `${myFullName} & ${partnerFullName}`;


  useEffect(() => {
    const handleValidation = () => {
      if (!legalData || !legalData.haveChildren) return;
  
      let cardIsValid: boolean = true;
  
      if (legalData.haveChildren[0] === 1) {
        if (legalData.children && legalData.children.length > 0) {
          legalData.children.forEach((child: any) => {
            if (
              !child.firstName ||
              child.firstName === '' ||
              !child.lastName ||
              child.lastName === '' ||
              !child.gender ||
              !child.gender[0] ||
              !child.birthDate ||
              child.birthDate === ''
            ) {
              cardIsValid = false;
            }
          });
        } else {
          cardIsValid = false;
        }
      }
  
      validateCard(id || '', cardIsValid);
    };
    handleValidation();
  }, [legalData, validateCard, id]);

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
            t(`${cardName}.closedText`) +
            `: ` +
            (legalData.haveChildren && legalData.haveChildren[0] === 2
              ? t(`${cardName}.answers.${legalData.haveChildren[0] - 1}`)
              : legalData.children.length > 0
              ? legalData.children.map((c: any, i: number) => {
                  return ` ${c.firstName} ( ${c.birthDate} )`;
                })
              : '')
          }
        >
          <KFormSection>
            <KFormRow>
              <KFormCol width={1}>
                <CardHeading>{t(`${cardName}.title`, { value: fullNames })}</CardHeading>
              </KFormCol>
            </KFormRow>
            <KFormRow>
              <KFormCol width={1}>
                <Heading4>{t(`${cardName}.question`, { value: fullNames })}</Heading4>
              </KFormCol>
            </KFormRow>
            <KFormRow>
              <KFormCol width={1}>
                <KRadio
                  name={'haveChildren'}
                  label={t(`${cardName}.question`)}
                  noLabel
                  itemsName={[0, 1].map((e) => {
                    return t(`${cardName}.answers.${e}`);
                  })}
                  itemsValue={[1, 2]}
                  fieldValue={legalData.haveChildren}
                  setFieldValue={props.setFieldValue}
                />
              </KFormCol>
            </KFormRow>
          </KFormSection>
          {legalData.haveChildren && legalData.haveChildren[0] === 1 ? (
            <KFormSection>
              <KFieldArray
                name={'children'}
                label={t(`general.children`)}
                addText={t(`general.addChildren`)}
                setFieldValue={manipulateChildren}
                fieldValue={children}
              >
                <KFormRow>
                  <KFormCol width={1 / 2} force={true}>
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
                  <KFormCol width={1 / 2} force={true}>
                    <KDatePicker name={'birthDate'} label={t(`general.birthDate`)} />
                  </KFormCol>
                  <KFormCol width={1 / 2} force={true}>
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
