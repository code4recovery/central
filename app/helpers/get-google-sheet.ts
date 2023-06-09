import { formatSlug } from "./format-slug";

type Row = { [key: string]: string };

export async function getGoogleSheet(sheetId: string) {
  const rows: Row[] = [];

  const data = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A1:Z10000?key=${process.env.GOOGLE_API_KEY}`;
  const response = await fetch(data);
  const { values } = await response.json();

  const headers: string[] = [];
  values
    .shift()
    .forEach((header: string) => headers.push(formatSlug(header, headers)));

  values.forEach((value: string[]) => {
    const row: Row = {};
    headers.forEach((header, index) => {
      row[header] = value[index] ? value[index].trim() : "";
    });
    rows.push(row);
  });

  return rows;
}
