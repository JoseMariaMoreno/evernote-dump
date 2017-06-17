export interface NotesMetadataResultSpec {
    includeTitle?: boolean;
    includeContentLength?: boolean;
    includeCreated?: boolean;
    includeUpdated?: boolean;
    includeDeleted?: boolean;
    includeUpdateSequenceNum?: boolean;
    includeNotebookGuid?: boolean;
    includeTagGuids?: boolean;
    includeAttributes?: boolean;
    includeLargestResourceMime?: boolean;
    includeLargestResourceSize?: boolean;
}
