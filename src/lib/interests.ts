export const USER_INTERESTS = [
  { value: "akupunktur", label: "Akupunktur" },
  { value: "herbal", label: "Herbal TCM" },
  { value: "diet-tcm", label: "Diet & pola makan" },
  { value: "qigong", label: "Qigong / latihan napas" },
  { value: "teori-dasar", label: "Teori dasar TCM" },
  { value: "kasus-klinis", label: "Kasus klinis" },
  { value: "praktisi", label: "Praktisi terverifikasi" },
  { value: "komunitas", label: "Diskusi komunitas" },
] as const;

export type UserInterest = (typeof USER_INTERESTS)[number]["value"];

export function interestLabel(value: string) {
  return USER_INTERESTS.find((item) => item.value === value)?.label ?? value;
}
