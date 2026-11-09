// Fixed energy-unit conversion, independent of geography or emissions factors.
// NIST SP 811, Appendix B.9: therm (EC) = 105506000 J; kWh = 3600000 J.
// https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9
// Existing generic therm input uses this explicitly documented EC convention.
// The U.S. therm is a different unit; this does not select a convention by country.
export const THERM_EC_TO_KWH = 105506000 / 3600000;
export const THERM_CONVERSION_SOURCE = "NIST SP 811 Appendix B.9, therm (EC); 105506000 J / 3600000 J per kWh";
