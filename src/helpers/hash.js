import { effect, signal } from "@preact/signals";

const getHashParams = () =>
  new URLSearchParams(window.location.hash.replace(/^#/, ""));

export const hashSignal = (
  hashKey,
  defaultValue,
  encoder = (val) => val,
  decoder = (val) => val
) => {
  const getValue = () => {
    const params = getHashParams();
    return params.has(hashKey) ? decoder(params.get(hashKey)) : defaultValue;
  };
  const sig = signal(getValue());
  effect(() =>
    window.addEventListener("hashchange", () => (sig.value = getValue()), false)
  );
  effect(() => {
    const params = getHashParams();
    sig.value === defaultValue
      ? params.delete(hashKey)
      : params.set(hashKey, encoder(sig.value));
    let hashString = params.toString();
    // Fix encoding of map parameter.
    if (params.has("map"))
      hashString = hashString.replace(
        /(^|&)map=[^&]+/,
        `$1map=${params.get("map")}`
      );
    window.history.replaceState(
      window.history.state,
      "",
      hashString ? `#${hashString}` : ""
    );
  });
  return sig;
};
