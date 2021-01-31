import React, { useState, forwardRef, useImperativeHandle, useEffect, useCallback } from 'react';
import { KFormCardStyled, EditButton, HelpBar, StyledIndicator, RemoveButton } from './kFormCard_styles';
import { Row, Col, PrimaryButton } from '../../common/styled';
import { useTranslation } from 'react-i18next';
import Collapse from '@material-ui/core/Collapse';
import authService from '../../../services/authService';
import KFormElement from '../KFormElement';

export interface KFormCard_Props {
  id: string | undefined;
  ref?: any;
  cardName: string | undefined;
  cardNumber?: number | undefined;
  state?: boolean | undefined;
  closedText?: string | undefined;
  disabled?: boolean | undefined;
  position?: 'left' | 'right' | undefined;
  acceptButtonPosition?: 'left' | 'right' | 'center' | undefined;
  handleApprove?: Function | undefined;
  toggleHelp: (id: string) => void;
  children: any;
  style?: any;
  customParams?: KFormCard_CustomParams;
}

interface KFormCard_CustomParams{
  cardStyle?: any;
  acceptButtonPosition?: 'left' | 'right' | 'center';
  primaryButton?: 'show' | 'hide';
  primaryButtonText?: string;
  removeButton?: 'show' | 'hide';
  removeButtonText?: string;
  removeFunction?: Function;
  getValueOnClick?: (value:any) => void;
}

function usePrevious(value: boolean | undefined) {
  const [previous, setPrevious] = useState<boolean | undefined>(value);

  useEffect(() => {
    setPrevious(value);
  }, [value]);

  return previous;
}

const KFormCard: React.FC<KFormCard_Props> = forwardRef((props: KFormCard_Props, ref: any) => {
  const { handleApprove, state, closedText, customParams } = props;
  const [editable, setEditable] = useState<boolean>(true);
  const { t } = useTranslation(['global']);

  const prevState = usePrevious(props.state);

  const customControl : KFormCard_CustomParams = {
    primaryButton: 'show',
    primaryButtonText: t('global:approve'),
    removeButton: 'hide',
    removeButtonText: t('global:remove'),
    ...customParams
  }

  const handleApproveInternal = useCallback(
    (x: boolean) => {
      if (handleApprove) handleApprove(x);
      setEditable(x === true ? !state || !closedText : true);
    },
    [handleApprove, state, closedText]
  );

  useImperativeHandle(ref, () => ({
    handleApprove: (x: boolean) => handleApproveInternal(x)
  }));

  useEffect(() => {
    if (prevState === undefined && props.state === true) handleApproveInternal(true);
  }, [props.state, handleApproveInternal, prevState]);

  const handleToggleHelp = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    props.toggleHelp(props.cardName || '');
  };

  const handleEditing = () => {
    if (!editable) {
      handleApproveInternal(false);
      setEditable(true);
    }
  };

  return (
    <KFormCardStyled
      className={`${props.disabled && !props.state ? 'disabled' : ''} ${editable ? 'editable' : ''}`}
      editable={editable}
      state={props.state ? 'valid' : ''}
      onClick={handleEditing}
      style={props.style}
    >
      {props.cardNumber !== undefined && props.cardNumber > 0 && (
        <KIndicator nr={props.cardNumber} position={props.position} state={props.state ? 'valid' : ''} />
      )}
      <Collapse in={editable}>
        <KFormElement
          onSubmit={(evt: any) => {
            authService.syncDossier('save');
            handleApproveInternal(true);
          }}
        >
          {props.children && props.disabled && props.children.length > 0 ? props.children[0] : props.children}
          {customControl.primaryButton === 'show' && 
          props.handleApprove && (!props.disabled || (editable && props.state)) && (
            <Row noMargin>
              <Col center>
                <PrimaryButton
                  type="submit"
                  disabled={!props.state}
                  className={`next-button-${props.acceptButtonPosition ? props.acceptButtonPosition : 'center'}`}
                >
                  {customControl.primaryButtonText}
                </PrimaryButton>
              </Col>
            </Row>
          )}
        </KFormElement>
      </Collapse>
      
      {customControl.removeButton === 'show' && editable ? (
        <RemoveButton
          onClick={() => customControl.removeFunction && customControl.removeFunction()}
        >
          {customControl.removeButtonText}
        </RemoveButton>
      ) : '' }
      {editable ? (
        <HelpBar id={props.id} valid={props.state ? true : false} onClick={handleToggleHelp} visible={true} />
      ) : (
        <p>{props.closedText}</p>
      )}

      {!editable && <EditButton className="far fa-edit" />}
    </KFormCardStyled>
  );
});

KFormCard.defaultProps = {
  cardNumber: 0,
  position: 'left',
  disabled: undefined
};
export default KFormCard;

interface KIndicator_Props {
  nr: number;
  state: string;
  position?: 'left' | 'right' | undefined;
}

export const KIndicator: React.FC<KIndicator_Props> = ({ nr, position, state = '', ...props }) => {
  return (
    <StyledIndicator state={state} position={position} className="indicator">
      <div className="line" />
      <div className="small-circle">
        <div className="text">{nr}</div>
      </div>
      <div className="big-circle"></div>
    </StyledIndicator>
  );
};

KIndicator.defaultProps = {
  position: 'left'
};
