// Verzendinstelling (EmailJS) voor het offerteformulier — zie
// project/LEDsation Offerte E-mail.html voor de bijbehorende e-mailtemplate.
// Zolang een van deze op "VERVANG_MIJ" staat, valt het formulier terug op de
// mailclient (mailto) van de bezoeker.
export const EMAILJS_PUBLIC_KEY = "k9bh-MZjONBtW3HZy";
export const EMAILJS_SERVICE_ID = "service_pmf051l";
export const EMAILJS_TEMPLATE_ID = "template_htyxg98";
export const FALLBACK_EMAIL = "hulya@drukbaas.nl";

export function isEmailjsConfigured(): boolean {
  return [EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID].every(
    (v) => v && v.indexOf("VERVANG_MIJ") === -1,
  );
}
