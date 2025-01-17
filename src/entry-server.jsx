import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
/**
 * @param {string} _url
 */
export function render(_url) {
  const html = renderToString(<StrictMode></StrictMode>);
  return { html };
}
