---
paths:
    - build.zip
---

# General

## Always push the fresh build.zip after every task

After finishing any prompt/task (and committing the code), git add the fresh build.zip at the repo root and include it in the same push to origin/main. The deployment/server pulls the current build.zip from GitHub, so never finish without pushing an updated build.zip.
