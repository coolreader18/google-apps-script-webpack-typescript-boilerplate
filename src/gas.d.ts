interface GetEvent {
  queryString: string;
  contextPath: "";
  contextLength: number;
  parameter: {
    [k: string]: string;
  };
  parameters: {
    [k: string]: string[];
  };
}

type DoGet = (e: GetEvent) => GoogleAppsScript.Content.TextOutput;

interface PostEvent extends GetEvent {
  postData: {
    length: number;
    type: GoogleAppsScript.Content.MimeType;
    contents: string;
    name: "postData";
  };
}

type DoPost = (e: PostEvent) => GoogleAppsScript.Content.TextOutput;
