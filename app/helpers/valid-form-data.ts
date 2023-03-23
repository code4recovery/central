export async function validFormData(request: Request) {
  const formData = await request.formData();
  return Object.fromEntries(formData.entries());
}
