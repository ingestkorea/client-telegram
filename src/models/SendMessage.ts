export interface SendMessageInput {
    text: string
    parse_mode?: ParseMode
    disable_web_page_preview?: boolean
};

export type ParseMode = 'MarkdownV2' | 'HTML' | 'Markdown';

export interface SendMessageOutput {
    ok?: boolean,
    result?: Result
};

export interface Result {
    message_id?: number,
    from?: From,
    chat?: Chat,
    date?: number,
    text?: string,
    entities?: Entities[]
};

export interface From {
    id?: number,
    is_bot?: boolean,
    first_name?: string,
    username?: string
};

export interface Chat {
    id?: number,
    first_name?: string,
    last_name?: string,
    username?: string,
    type?: string
};

export interface Entities {
    offset?: number
    length?: number
    type?: string
};