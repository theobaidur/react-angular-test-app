import React from "react";
import { KCheck } from "..";
import KFormCard from "../KFormCard";
import { KFormRow, KFormCol, KFormCardAdd } from "../KForm_styles";
import { CardArrayInitiator_Props } from "./CardArrayInitiator_Props";

export const CardArrayInitiator: React.FC<CardArrayInitiator_Props> = ({
  id,
  cardName,
  legalData,
  t,
  addCard,
  ...props
}) => {

  const primaryButton : 'show' | 'hide' =
      legalData && (
          (legalData.array && legalData.array.length > 0) || ( legalData.hasNoElements && legalData.hasNoElements[0] === 1 )
      ) ? 'show' : 'hide';

  const primaryButtonText : string =
      legalData && (legalData.hasNoElements && legalData.hasNoElements[0] === 1) ?
      t(`${cardName}.init.accept`) : t(`${cardName}.init.noMore`);

  const closedText =
      legalData && (legalData.hasNoElements && legalData.hasNoElements[0] === 1) ?
      t(`${cardName}.init.hasNoElements`) : t(`${cardName}.init.noMore`);

  return(
      <KFormCard
          id={id}
          cardName={cardName + '_init'}
          state={true}
          handleApprove={props.handleApprove}
          toggleHelp={props.toggleHelp}
          position={props.position}
          closedText={ closedText }
          customParams={{
              primaryButton: primaryButton,
              primaryButtonText: primaryButtonText
          }}
          >
          { legalData &&
          ( !legalData.hasNoElements || legalData.hasNoElements[0] !== 1 ) ? (
          <KFormRow>
              <KFormCol width={1}>
                  <KFormCardAdd>
                      <div
                          className='button'
                          onClick={addCard}
                      >
                      </div>
                      <div
                          onClick={addCard}
                          className='text'
                      >
                          {t(`${cardName}.init.add`)}
                      </div>
                  </KFormCardAdd>
              </KFormCol>
          </KFormRow>
          ) : '' }
          { legalData &&
          ( !legalData.array || (legalData.array && legalData.array.length < 1) ) ? (
          <KFormRow>
              <KFormCol width={1}>
                  <KCheck
                      fieldValue={legalData.hasNoElements}
                      name={`hasNoElements`}
                      itemsValue={[1]}
                      itemsName={[t(`${cardName}.init.hasNoElements`)]}
                      setFieldValue={props.setFieldValue}
                  />
              </KFormCol>
          </KFormRow>
          ) : '' }
      </KFormCard>
  );
}
