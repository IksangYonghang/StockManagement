function amountToWords(value) {
  let ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  let tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  let digit = 0;

  if (value === 0) {
    return "zero";
  }

  let integerPart = Math.floor(value);

  if (integerPart < 20) {
    return ones[integerPart];
  }

  if (integerPart < 100) {
    digit = integerPart % 10;
    return (
      tens[Math.floor(integerPart / 10)] + " " + (digit > 0 ? ones[digit] : "")
    );
  }

  if (integerPart < 1000) {
    return (
      ones[Math.floor(integerPart / 100)] +
      " Hundred " +
      (integerPart % 100 > 0 ? amountToWords(integerPart % 100) : "")
    );
  }

  if (integerPart < 100000) {
    return (
      amountToWords(Math.floor(integerPart / 1000)) +
      " Thousand " +
      (integerPart % 1000 > 0 ? amountToWords(integerPart % 1000) : "")
    );
  }

  if (integerPart < 10000000) {
    return (
      amountToWords(Math.floor(integerPart / 100000)) +
      " Lakh " +
      (integerPart % 100000 > 0 ? amountToWords(integerPart % 100000) : "")
    );
  }

  return (
    amountToWords(Math.floor(integerPart / 10000000)) +
    " Crore " +
    (integerPart % 10000000 > 0 ? amountToWords(integerPart % 10000000) : "")
  );
}

export default amountToWords;
