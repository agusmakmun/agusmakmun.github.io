---
layout: post
title:  "How to fix InconsistentMigrationHistory or other issues because migrations files are changed by 3rd party packages"
date:   2024-03-24 23:15:00 +0700
categories: [python, django]
---

Sometimes we have case where we want to upgrade the 3rd party packages.
But, we have case where the migration files were totally different with the old version.

While upgrading the dj-stripe version, the migration files were totally different.
And it causing inconsistent migration history or other migration issues.

So, to fix this we need to reset the **`django_migrations`** table after deployment is done, then restart the pods/containers.

### a. Steps for Docker:
1. Deploy
2. Execute below commands:

```sh
docker exec -it <postgres_container_name_or_id> psql -U <username> <database_name>
DROP TABLE django_migrations;
```

Then:

```sh
docker-compose -f local.yml run django python manage.py migrate --fake
docker-compose -f local.yml run django python manage.py migrate
```

3. Then restart all containers.


### b. Steps for k8s pod:
1. Deploy
2. Execute below commands:

Run this in the postgres database:

```sh
psql -U <username> <database_name>
DROP TABLE django_migrations;
```

Then, migrate the table;

```sh
kubectl --kubeconfig=/path/to/kubeconfig get pods | grep django
kubectl --kubeconfig=/path/to/kubeconfig exec --stdin --tty django-xxxxx -- /bin/bash

source /entrypoint

python manage.py migrate --fake
python manage.py migrate
```

3. Then restart all pods.
