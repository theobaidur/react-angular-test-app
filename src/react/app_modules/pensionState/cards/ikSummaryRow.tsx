import React from "react";
import { Icon, IconButtonWithText, CounterLabel, CardHeading, CardQuestion } from '../../../components/common/styled';
import { KNumber, KDatePicker } from "src/react/components/KForm";
import { KFormRow, KFormCol } from "src/react/components/KForm/KForm_styles";
import { IkSummaryRow_Props } from "./IkSummaryRow_Props";

export const IkSummaryRow: React.FC<IkSummaryRow_Props> = React.memo(
  ({
    item,
    index,
    removeItemFromList,
    updateListItem,
    t,
    onClick,
    cardName,
    isIncomeCodeVisible,
    pageIndex,
    validator
  }) => {
    const removeItemFromListClick = () => {
      removeItemFromList('ikSummaryItems', index, pageIndex);
    };
    return (
      <KFormRow key={index}>
        <KFormCol width={1 / 12} force alignItems="center">
          <CounterLabel
            valid={
              isIncomeCodeVisible
                ? item.incomeCode && item.year && (item.income || item.income === 0)
                  ? 'valid'
                  : ''
                : item.year && (item.income || item.income === 0)
                ? 'valid'
                : ''
            }
          >
            {index + 1}
          </CounterLabel>
        </KFormCol>
        {isIncomeCodeVisible && (
          <KFormCol width={3 / 12} force>
            <KNumber
              name={`ikSummaryItems.${index}.incomeCode`}
              label={t(`${cardName}.incomeCode`)}
              fieldValue={item.incomeCode}
              needVerify={item.isCodeValid ? '' : t(`${cardName}.needVerifyIncomeCode`)}
              setFieldValue={updateListItem}
              onClick={onClick}
              validator={validator}
              validations={`required_or_zero`}
            />
          </KFormCol>
        )}
        <KFormCol width={isIncomeCodeVisible ? 1 / 4 : 5 / 12} force>
          <KDatePicker
            name={`ikSummaryItems.${index}.year`}
            label={t(`${cardName}.incomeYear`)}
            format={'YYYY'}
            fieldValue={item.year}
            setFieldValue={updateListItem}
            onClick={onClick}
            validator={validator}
            validations={`required`}
          />
        </KFormCol>
        <KFormCol width={isIncomeCodeVisible ? 1 / 3 : 5 / 12} force>
          <KNumber
            name={`ikSummaryItems.${index}.income`}
            label={t(`${cardName}.incomeAmmount`)}
            fieldValue={item.income}
            setFieldValue={updateListItem}
            onClick={onClick}
            validator={validator}
            validations={`required_or_zero|min:-999999,num`}
          />
        </KFormCol>
        <KFormCol width={1 / 12} force alignItems="center">
          <Icon style={{ padding: 0, margin: 0 }} size="32" content="close" onClick={removeItemFromListClick} />
        </KFormCol>
      </KFormRow>
    );
  }
);
