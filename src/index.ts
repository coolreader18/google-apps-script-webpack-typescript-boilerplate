import "core-js/fn/object/assign";
import React from "react";
import ReactDOMServer from "react-dom/server";
import App, { AppProps } from "./client/App";
import indexTemplate from "./client/index.html";
import getFile from "./getFile";

const content = getFile("client");

export const doGet: DoGet = () => {
  const props: AppProps = { ip: "a" };

  const template = HtmlService.createTemplate(indexTemplate);
  Object.assign(template, {
    renderedString: ReactDOMServer.renderToString(React.createElement(App)),
    initialState: `<script>__INITIAL_STATE__=${JSON.stringify(props)}</script>`,
    clientScript: `<script>${content}</script>`
  });

  const result = template.evaluate();

  Logger.log(result.getAs("text/html").getDataAsString());

  return result;
};
