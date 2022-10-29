export const scoreCalculator = (emojiList: string[]) => {
  let value = 0;
  for (let emoji of emojiList) {
    if (emoji == "U+1F44D") {
      value++;
    } else if (emoji == "U+1F44E") {
      value--;
    }
  }
  return value;
};
