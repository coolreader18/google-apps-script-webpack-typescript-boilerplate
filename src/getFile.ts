const getFile = (filename: string) =>
  JSON.parse(
    HtmlService.createTemplateFromFile(`${filename}.data.html`)
      .getRawContent()
      .slice(2, -2)
  );

export default getFile;
