export function getHashObject(defaults, all = false) {
  const hash = window.location.hash.replace("#", "");
  const obj = { ...defaults };
  hash
    .split("&")
    .map((part) => part.split("="))
    .filter((kv) => all || kv[0] in defaults)
    .forEach((kv) => {
      obj[kv[0]] = decodeURIComponent(kv[1]);
    });
  return obj;
}

export function getHashString(obj, defaults, excluded = []) {
  obj = { ...getHashObject(defaults, true), ...obj };
  let kv = Object.keys(obj)
    .filter((k) => !(excluded.includes(k) || obj[k] == defaults[k]))
    .map((k) => `${k}=${k == "map" ? obj[k] : encodeURIComponent(obj[k])}`)
    .join("&");
  return kv ? `#${kv}` : "";
}
