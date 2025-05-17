

export interface RootState {
    loader: {
        status: boolean;
        // Other loader properties if any
    };
    auth: {
        user: {
            profile: UserProfile
        }
    };
    // Other slices of your state
}

export type UserType = "admin" | "maker" | "checker" | "client";

export const UserTypeAdmin: UserType = "admin"
export const UserTypeMaker: UserType = "maker"

export interface UserProfile {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    user_type: UserType | string;
    user_status: string;
    meta_data: any;
    created_at: string;
    updated_at: string;
    phone_number?: string;
}

export interface UserCreateResponse {
    success: boolean;
    user: UserProfile;
}



