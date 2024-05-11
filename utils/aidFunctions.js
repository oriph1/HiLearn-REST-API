exports.removeDuplicates = (courses) => {
  const unique = [];
  courses.forEach((element) => {
    const strElement = String(element); // Convert element to string
    if (!unique.includes(strElement)) {
      unique.push(strElement);
    }
  });
  return unique;
};
