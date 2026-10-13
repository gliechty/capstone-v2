import { z } from "zod";
// Appsmith inp_notes.maxChars: 1000. JS/HTML length uses UTF-16 code units.
// Preserve user text verbatim; absence in pre-restoration data means empty.
export const NOTES_MAX_LENGTH = 1000;
export const notesSchema = z.string().max(NOTES_MAX_LENGTH).default("");
