import { useEffect, EffectCallback } from "react";

/// Will only be called once
/// and won't cause "react-hooks/exhaustive-deps" ESLint rule to fire
export default function useEffectOnlyOnce(effect: EffectCallback) {
  useEffect(effect, []);
}

