# NocoDB — v1 Role

NocoDB was a development/testing aid, not part of the final production application data path.

Server inspection found:

- one NocoDB-backed PostgreSQL database (`nocodb`);
- 102 NocoDB system/metadata relations;
- exactly one user model in `nc_models_v2`: `test_smes`;
- no production Capstone domain models.

The authoritative final v1 application used Google Sheets for QuestionBank/configuration/retrieval data.

For migration purposes:

- do not treat the NocoDB/PostgreSQL schema as the v1 product data model;
- do not import NocoDB's internal `nc_*` tables into v2;
- do not use `test_smes` as a production schema requirement;
- design the v2 database from the preserved v1 contracts and canonical config files.

A PostgreSQL schema dump is intentionally omitted because it would primarily capture NocoDB implementation internals and would be misleading as a Capstone application schema.
