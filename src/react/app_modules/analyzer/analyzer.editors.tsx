import React, { useEffect, useState } from 'react';
import { constantNumbers } from '../../utils/calculators';
import ModalEditor from '../../components/common/modalEditor';
import { GeneralText } from '../../components/common/styled';
import { KSlider, KNumber } from '../../components/KForm';
import { KFormRow, KFormCol } from '../../components/KForm/KForm_styles';
import showNum from '../../utils/showNum';
import SimpleValidator from '../../utils/validator';

export const NeedsEditor: React.FC<any> = ({
  isOpen,
  setOpen,
  firstName,
  onEditorApprove,
  mode,
  t,
  gender,
  toggleHelp,
  data,
  setData
}) => {
  const defaultRetirement: number = constantNumbers.defaultPension[gender - 1] || 0;
  const minRetirementStart: number = defaultRetirement - 10;
  const maxRetirementStart: number = defaultRetirement + 10;
  const id = mode === 1 ? 'pension' : mode === 2 ? 'disability' : 'leftBehind';

  return (
    <ModalEditor
      title={t(`need.title`, { name: firstName })}
      isOpen={isOpen}
      handleToggleHelp={toggleHelp}
      t={t}
      onApprove={() => onEditorApprove('need')}
      id={id}
      onClose={setOpen}
      allowApprove={true}
    >
      {mode === 1 ? (
        <>
          <GeneralText style={{ margin: '0 0 40px' }}>{t(`need.slider`)}</GeneralText>
          {data.startAge && (
            <KSlider
              name="startAge"
              min={minRetirementStart}
              max={maxRetirementStart}
              step={1}
              markStep={1}
              autoHideLabel={false}
              marks={true}
              fieldValue={data.startAge}
              setFieldValue={(name: string, value: number) => setData((needs: any) => ({ ...needs, [name]: value }))}
            />
          )}
        </>
      ) : (
        ''
      )}

      <GeneralText>{t(`need.month`)}</GeneralText>
      <KFormRow>
        <KFormCol width={1 / 2}>
          <KNumber
            name="month"
            label={t(`modules:currency`)}
            fieldValue={data.month}
            setFieldValue={(name: string, value: number) => setData((needs: any) => ({ ...needs, [name]: value }))}
          />
        </KFormCol>
        <KFormCol width={1 / 2} />
      </KFormRow>
    </ModalEditor>
  );
};

export const WealthEditor: React.FC<any> = ({
  isOpen,
  setOpen,
  firstName,
  onEditorApprove,
  mode,
  t,
  toggleHelp,
  data,
  setData
}) => {
  const id = mode === 1 ? 'pension' : mode === 2 ? 'disability' : 'leftBehind';
  const [isValid, setValid] = useState<boolean>(true);
  const validator = new SimpleValidator();

  useEffect(() => {
    setValid(validator.allValid());
  }, [data, validator]);

  return (
    <ModalEditor
      title={t(`wealth.title`, { name: firstName })}
      isOpen={isOpen}
      handleToggleHelp={toggleHelp}
      t={t}
      onApprove={() => onEditorApprove('wealth')}
      id={id}
      onClose={setOpen}
      allowApprove={isValid}
    >
      {data.hasWealthPerson ? (
        <>
          <GeneralText>{t(`wealth.person`)}</GeneralText>
          <KFormRow>
            <KFormCol width={1 / 2}>
              <KNumber
                name={'personUse'}
                label={t(`wealth.personLabel`)}
                validator={validator}
                validations={`required|max:${data.personAvailable},num|min:0,num`}
                fieldValue={data.personUse}
                setFieldValue={(name: string, value: number) =>
                  setData((wealth: any) => ({ ...wealth, [name]: value }))
                }
              />
            </KFormCol>
            <KFormCol width={1 / 2} />
          </KFormRow>
          <KFormRow>
            <KFormCol width={1}>
              <GeneralText color={'grey1'}>{t(`wealth.personAvailable`) + showNum(data.personAvailable)}</GeneralText>
            </KFormCol>
          </KFormRow>
        </>
      ) : (
        ''
      )}
      {data.hasWealthCon ? (
        <>
          <GeneralText>{t(`wealth.connection`)}</GeneralText>
          <KFormRow>
            <KFormCol width={1 / 2}>
              <KNumber
                name={'connectionUse'}
                label={t(`wealth.connectionLabel`)}
                validator={validator}
                validations={`required|max:${data.connectionAvailable},num|min:0,num`}
                fieldValue={data.connectionUse}
                setFieldValue={(name: string, value: number) =>
                  setData((wealth: any) => ({ ...wealth, [name]: value }))
                }
              />
            </KFormCol>
            <KFormCol width={1 / 2} />
          </KFormRow>
          <KFormRow>
            <KFormCol width={1}>
              <GeneralText color={'grey1'}>
                {t(`wealth.connectionAvailable`) + showNum(data.connectionAvailable)}
              </GeneralText>
            </KFormCol>
          </KFormRow>
        </>
      ) : (
        ''
      )}
    </ModalEditor>
  );
};


export const PensionPrivateEditor: React.FC<any> = ({
  isOpen,
  setOpen,
  firstName,
  onEditorApprove,
  mode,
  t,
  toggleHelp,
  data,
  setData
}) => {
  const id = mode === 1 ? 'pension' : mode === 2 ? 'disability' : 'leftBehind';
  const [isValid, setValid] = useState<boolean>(true);
  const validator = new SimpleValidator();

  const updateData = (id:string, subId:string|undefined, name:string, value:any) => {
    const newData : any[] = data.map((elem:any) => {
      if(id===elem.id && (!subId || subId === elem.subId) ){
        elem[name] = value; }
      return elem;
    });
    setData([...newData])
  };

  useEffect(() => {
    setValid(validator.allValid());
  }, [data, validator]);

  return (
    <ModalEditor
      title={t(`pensionPrivate.title`, { name: firstName })}
      isOpen={isOpen}
      handleToggleHelp={toggleHelp}
      t={t}
      onApprove={() => onEditorApprove('pensionPrivate')}
      id={id}
      onClose={setOpen}
      allowApprove={isValid}
    >
    <>
      {
      data.map((elem:any,i:number) => (
      <div key={i}>
      <GeneralText>{ elem.name + ' - ' + t(`pensionPrivate.${elem.disc}`) }</GeneralText>
          <KFormRow>
            <KFormCol width={1 / 2}>
              <KNumber
                name={'use'}
                label={t(`pensionPrivate.use`)}
                validator={validator}
                validations={`required|max:${elem.value},num|min:0,num`}
                fieldValue={elem.use}
                setFieldValue={(name: string, value: number) =>
                  updateData(elem.id,elem.subId,name,value)
                }
              />
            </KFormCol>
            <KFormCol width={1 / 2} />
          </KFormRow>
          <KFormRow>
            <KFormCol width={1}>
              <GeneralText color={'grey1'}>{t(`pensionPrivate.available`) + showNum(elem.value)}</GeneralText>
            </KFormCol>
          </KFormRow>
        </div>
              ))}
        </>
    </ModalEditor>
  );
};
