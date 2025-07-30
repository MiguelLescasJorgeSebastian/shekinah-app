import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    permissions?: string[];
    roles?: string[];
    [key: string]: unknown; // This allows for additional properties...
}

export interface PageProps<T extends Record<string, unknown> = Record<string, unknown>> extends T {
    auth: Auth;
}

export interface Ministry {
    id: number;
    name: string;
    description?: string;
    leader_id?: number;
    parent_id?: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    leader?: User;
    parent?: Ministry;
    children?: Ministry[];
    servers?: Server[];
    schedules?: Schedule[];
}

export interface Server {
    id: number;
    user_id: number;
    ministry_id: number;
    role: string;
    is_active: boolean;
    notes?: string;
    created_at: string;
    updated_at: string;
    user: User;
    ministry: Ministry;
    schedules?: Schedule[];
}

export interface Event {
    id: number;
    name: string;
    description?: string;
    type: 'service' | 'meeting' | 'special' | 'training' | 'outreach';
    start_datetime: string;
    end_datetime: string;
    location?: string;
    required_ministries?: number[];
    status: 'planned' | 'confirmed' | 'cancelled' | 'completed';
    created_by: number;
    created_at: string;
    updated_at: string;
    creator?: User;
    schedules?: Schedule[];
}

export interface Schedule {
    id: number;
    event_id?: number;
    ministry_id: number;
    server_id?: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    notes?: string;
    status: 'assigned' | 'confirmed' | 'cancelled' | 'completed';
    created_at: string;
    updated_at: string;
    event?: Event;
    ministry: Ministry;
    server?: Server;
}

export interface Resource {
    id: number;
    name: string;
    description?: string;
    type: 'document' | 'video' | 'audio' | 'image' | 'other';
    file_path?: string;
    url?: string;
    ministry_id?: number;
    uploaded_by: number;
    is_public: boolean;
    created_at: string;
    updated_at: string;
    ministry?: Ministry;
    uploader: User;
}
