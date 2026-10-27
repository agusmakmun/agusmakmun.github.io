source 'https://rubygems.org'

gem 'jekyll', '~> 4.4'

group :jekyll_plugins do
  gem 'jekyll-paginate'
  gem 'jekyll-gist'
  gem 'jekyll-seo-tag'
end

# Link checker for `make check`; skipped by the deploy workflow (BUNDLE_WITHOUT: test).
group :test do
  gem 'html-proofer', '~> 5.0'
end
