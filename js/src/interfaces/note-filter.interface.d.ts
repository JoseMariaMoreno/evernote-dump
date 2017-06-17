export interface NoteFilter {
    order?: number;
    ascending?: boolean;
    words?: string;
    notebookGuid?: string;
    tagGuids?: string[];
    timeZone?: string;
    inactive?: boolean;
    emphasized?: string;
    includeAllReadableNotebooks?: boolean;
}
