import { Dayjs } from "dayjs";

export interface IPagePostAd {
    ID: string;
    Description: string;
    IsHTML: boolean;
    StartDate: string;
    EndDate: string;
    ContactID: string;
    Entity: string;
    UserEmail?: string;
    IsAdminApproved?: boolean;
    IsActive?: boolean;
    IsEditor?: boolean;
    FirstName?: string;
    LastName?: string;
    IsAdminPost?: boolean;
    Name?: string;
    Email?: string;
    IsAuthenticated?: boolean;
    Url?: string;
    DurationDays?: number;
    NumberOfImages?: number;
}

export interface IPostMainPageAdminService {
    saveEditorData(editorData: string,
        startDate: Dayjs | null,
        endDate: Dayjs | null
    ) : Promise<boolean>;
}