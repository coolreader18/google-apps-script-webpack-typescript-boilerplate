type WebOutput =
  | GoogleAppsScript.Content.TextOutput
  | GoogleAppsScript.HTML.HtmlOutput;

interface GetEvent<P extends string = string> {
  queryString: string;
  contextPath: "";
  contextLength: number;
  parameter: { [k in P]: string };
  parameters: { [k in P]: string[] };
}

type DoGet<P extends string = string> = (e: GetEvent<P>) => WebOutput;

interface PostEvent<P extends string = string> extends GetEvent<P> {
  postData: {
    length: number;
    type: GoogleAppsScript.Content.MimeType;
    contents: string;
    name: "postData";
  };
}

type DoPost<P extends string = string> = (e: PostEvent<P>) => WebOutput;

declare module "*.html" {
  const val: string;
  export default val;
}
