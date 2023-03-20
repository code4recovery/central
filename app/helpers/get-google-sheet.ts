import { formatSlug } from "./format-slug";

type Row = { [key: string]: string };

export async function getGoogleSheet(sheetId: string) {
  const rows: Row[] = [];

  const data = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A1:Z10000?key=${process.env.GOOGLE_SHEET_API_KEY}`;
  const response = await fetch(data);
  const { values } = await response.json();

  const headers: string[] = values
    .shift()
    .map((header: string) => formatSlug(header));

  values.forEach((value: string[]) => {
    const row: Row = {};
    headers.forEach((header, index) => {
      row[header] = value[index];
    });
    rows.push(row);
  });

  return rows;
}
