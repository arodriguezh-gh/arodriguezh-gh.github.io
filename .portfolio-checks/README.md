# Local source checks

From the repository root, run `node .portfolio-checks/verify-source.cjs .`. Requires Node.js, no packages. Checks content, rendered templates, section/navigation order, organization links and logos, assets, anchors, and archived comparison paths. It does not launch a browser.

The current iteration also passed a separate development-only headless Chrome pass at six mobile/desktop widths. It covered navigation, image decoding, Satoshi loading, disclosures, zoom, email draft preparation/reset, and direct-file preview. No forms were sent.

`backups/` contains earlier root files locally and is ignored by Git. Nothing in this folder is imported by production or linked from public navigation.
