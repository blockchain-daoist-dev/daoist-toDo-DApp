use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct UserProfile {
    pub authority: Pubkey,
    pub last_note: u8,
    pub note_count: u8,
}

#[account]
#[derive(Default)]
pub struct NoteAccount {
    pub authority: Pubkey,
    pub idx: u8,
    pub content: String,
    pub marked: bool,
}
