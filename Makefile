# Dev shortcuts. Ruby runs in Docker (see docker-compose.yml); Prettier runs via npx, no package.json needed.
#   make serve    run the site at http://localhost:4000
#   make format   format CSS, JS, YAML and the README
#   make check    formatting check + production build + internal link check
#
# Liquid templates (_layouts, _includes, *.html pages) and _posts are left out of Prettier on purpose:
# Prettier doesn't understand Jekyll's Liquid tags, and reformatting old posts is noise.
# html-proofer skips external links (slow, flaky), the share menu's recipient-less mailto:,
# and http:// links inside old posts (e.g. localhost in tutorials).

PRETTIER := npx --yes prettier@3
FILES := "static/css/*.css" "static/js/*.js" "_data/*.yml" _config.yml docker-compose.yml ".github/workflows/*.yml" README.md
JEKYLL := docker compose run --rm -e JEKYLL_ENV=production jekyll sh -c

.PHONY: serve format check

serve:
	docker compose up

format:
	$(PRETTIER) --write $(FILES)

check:
	$(PRETTIER) --check $(FILES)
	$(JEKYLL) 'bundle install --quiet && bundle exec jekyll build -d /tmp/site && bundle exec htmlproofer /tmp/site --disable-external --ignore-empty-mailto --no-enforce-https'
