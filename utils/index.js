export function objectToFormData(item) {
  const formData = new FormData();

  for (let [key, val] of Object.entries(item)) {
    formData.append(key, val);
  }

  return formData;
}
