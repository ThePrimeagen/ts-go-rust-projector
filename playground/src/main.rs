use std::path::PathBuf;

use anyhow::{Result, anyhow, Context};

fn error_me(throw: bool) -> Result<()> {
    if throw {
        return Err(anyhow!("this should never be true"));
    }

    std::fs::read(PathBuf::from("/foo")).context("Hey unable to do this")?;

    return Ok(());
}

fn main() -> Result<(), usize> {

    let value = error_me(false)?;

    if error_me(true).is_ok() {

    }

    return Ok(());
}
