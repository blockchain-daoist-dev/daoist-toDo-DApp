use anchor_lang::prelude::*;

// declare rs modules
pub mod constant;
pub mod error;
pub mod states;

// import custon rs modules
use crate::{ constant::*, error::*, states::* };


declare_id!("2Git8A58xvSLJCUFDp7JX2qDfxYCzcnKZo26AH1bNgkv");

#[program]
pub mod daoist_note_dApp {
    use super::*;

    pub fn initialize_user(
        ctx: Context<Initialize> 
    ) -> Result<()> {
        let user_profile = &mut ctx.accounts.user_profile;
        
        user_profile.authority = ctx.accounts.authority.key();
        user_profile.last_note = 0;
        user_profile.note_count = 0;
        // initial_account.value = String::from("Write your first message!");
        Ok(())
    }

    pub fn add_note(
        ctx: Context<AddNote>, 
        _content: String,
    ) -> Result<()> {

        // let storage_account = &mut ctx.accounts.storage_account;
        // storage_account.value = new_value;

        let note_account = &mut ctx.accounts.note_account;
        let user_profile = &mut ctx.accounts.user_profile;

        note_account.authority = ctx.accounts.authority.key();
        note_account.idx = user_profile.last_note;
        note_account.content = _content;
        note_account.marked = false;

        user_profile.last_note = user_profile.last_note
        .checked_add(1)
        .unwrap();

        user.profile.note_count = user_profile.note_count
        .checked_add(1)
        .unwrap()

        Ok(())
    }
}


#[derive(Accounts)]
#[instruction()]
pub struct InitializeUser<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        seeds = [USER_TAG, authority.key().as_ref()],
        bump,
        payer = authority,
        space = 8 + std::mem::size_of::<UserProfile>(),
    )]

    pub user_profile: Box<Account<'info, UserProfile>>,

    pub system_program: Program<'info, System>,
}

#[dervive(Accounts)]
#[instruction()]
pub struct AddNote<'info> {
    #[account(
        mut,
        seeds = [USER_TAG, authority.key().as_ref()],
        bump,
        has_one = authority,
    )]
    pub user_profile: Box<Account<'info, UserProfile>>,

    #[account(
        init,
        seeds = [NOTE_STATE, authority.key().as_ref(), &[user_profile.last_note as u8].as_ref()],
        bump,
        payer = authority,
        space = std::mem::size_of::<NoteAccount>() + 8,
    )]
    pub note_account: Box<Account<'info, NoteAccount>>,

    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}



// #[derive(Accounts)]
// pub struct Initialize<'info> {
//     #[account(init, payer = user, space = 9000)]
//     pub initial_account: Account<'info, Init>,
//     #[account(mut)]
//     pub user: Signer<'info>,
//     pub system_program: Program<'info, System>,
// }

// #[derive(Accounts)]
// pub struct UpdateValue<'info> {
//     #[account(mut)]
//     pub storage_account: Account<'info, Init>,
// }

// #[account]
// pub struct Init {
//     pub value: String,
// }
