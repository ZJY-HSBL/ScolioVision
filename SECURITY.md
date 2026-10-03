# Security Policy / 安全说明

ScolioVision is a public research prototype. Do not commit API keys, access tokens, patient identifiers, private radiographs, production credentials, or protected healthcare-system information to this repository.

The default frontend performs local preprocessing and does not require a third-party vision token. If remote inference is enabled, credentials must remain server-side and HTTPS should be used.

For medical-image research, de-identify data before use and follow applicable ethics, consent, institutional, access-control, and data-retention requirements.

If a credential is accidentally committed, revoke and rotate it immediately. Removing it only from the latest commit is insufficient because it may remain in Git history.
