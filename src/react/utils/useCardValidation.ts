import { useEffect } from "react";
import { Card_Props } from "../app_modules/module.interfaces";

export default function useCardValidation(props: Card_Props, person?: any) {
  const { id, legalData, mode, validateCard, validate } = props;
  useEffect(() => {
    const validation = validate && validate(legalData, mode, person);
    const valid = (validation && validation.done) || false;
    validateCard(id || '', valid);
  }, [id, legalData, mode, validate, validateCard]);
}
