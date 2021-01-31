
import React, { useState, useEffect } from "react";
import createGUID from "../../../utils/guidGenerator";
import { GeneralText } from "../../common/styled";
import { useMemoizedCallback } from "../../../utils/customCallbackHook";
import { KFormCardArray_Props } from "./KFormCardArray_Props";
import { CardArrayInitiator } from "./kFormCardArrayInitiator";
import KFormModal from "../KFormModal";

const KFormCardArray: React.FC<KFormCardArray_Props> = ({
    CardSample,
    validCards,
    refObj,
    id,
    cardName,
    legalData,
    setFieldValue,
    t,
    validateCard,

    ...props
}) => {

    const { array, hasNoElements } = legalData;

    const [activeCard, setActiveCard] = useState<string>('');
    const [openModal,setOpenModal] = useState<boolean>(false);

    const validateInitializer = useMemoizedCallback(() => {
        if( (array && array.length > 0) ||
            ( (!array || array.length < 1) && (hasNoElements && hasNoElements[0] === 1) )
        ) return true
        return false
    },[array,hasNoElements]);

    const addCard = () => {
        const newCard = refObj ? {} as typeof refObj : {};
        newCard.id = createGUID();
        const newArray = array ? [...array] : [];
        newCard.initIndex = newArray.length + 1;
        newArray.push( newCard );
        setFieldValue && setFieldValue( 'array', newArray );
        validateCard && validateCard( `${id}_init`, true );
        return newCard.id;
    }

    const removeCard = () => {
        const newArray = array.filter((x:any)=>x.id !== activeCard );
        setFieldValue && setFieldValue( 'array', newArray );
        validateCard && validateCard( id + activeCard, true ); // Quickfix to validate deleted items, should be removed from validCards array
        validateCard && validateCard( `${id}_init`, true );
    }

    const updateCard =
        ( cardId:string, propName: string, value: any ) => {
        if(value === undefined || value === null ) return;
        const newArray: any[] = array.map((card:any) => {
            if(card.id === cardId){
                card[propName] = value;
                const arrayCardId : any = (id && id + card.id) || 'default';
                const validation = props.validate && props.validate(card, props.mode);
                const valid = (validation && validation.done) || false;
                validateCard && validateCard(arrayCardId,valid);
            }
            return card;
        });
        setFieldValue && setFieldValue( 'array', newArray );
        validateCard && validateCard( `${id}_init`, true );
    }


    const removeModal = () => {
        removeCard();
        closeModal();
    }

    const closeModal = () => {
        setActiveCard('');
    }

    useEffect(()=>{
        setOpenModal( activeCard !== '' );
    },[activeCard]);

    useEffect(()=>{
        validateCard && validateCard( `${id}_init`, true );
    },[id,validateCard,validateInitializer]);

    return(
        <>
        { array && array.map( (cardData:any,i:number) => {
            const arrayCardId : any = (id && id + cardData.id) || 'default';
            i > 0 && props.cardNumber++;

            return( <CardSample
              key={i}
              id={ arrayCardId }
              cardName={cardName}
              legalData={cardData}
              t={t}
              isCardValid={validCards[arrayCardId]}
              setFieldValue={(name:string,value:any)=>updateCard(cardData.id,name,value)}
              customParams={{
                removeButton: 'show',
                removeButtonText: t(`${cardName}.removeElement`) || '',
                removeFunction: () => setActiveCard(cardData.id)
              }}
              validateCard={validateCard}
              {...props}
            /> )
        })}

        <CardArrayInitiator
            id={`${id}_init`}
            cardName={cardName}
            legalData={legalData}
            t={t}

            addCard={addCard}
            isCardValid={validCards[`${id}_init`]}
            setFieldValue={setFieldValue}
            validateCard={validateCard}
            {...props}
        />

        <KFormModal
            id={'removeModal'}
            name={'removeModal'}
            title={t(`removeModalTitle`)}
            isOpen={openModal}

            allowApprove={true}
            onApprove={removeModal}
            onClose={closeModal}
        >
            <GeneralText>
                {t(`removeModalContent`)}
            </GeneralText>
        </KFormModal>
        </>
    );
}

export default KFormCardArray;


