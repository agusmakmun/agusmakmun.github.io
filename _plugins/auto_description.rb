# Fills in `description` (used by jekyll-seo-tag and the post lists) when a page doesn't set one.
# Posts: the first ~160 characters of the rendered text. Category pages: a sentence from the category name.
require "cgi"

module AutoDescription
  LIMIT = 160

  def self.from_html(html)
    text = CGI.unescapeHTML(html.gsub(/<pre.*?<\/pre>/m, " ").gsub(/<[^>]+>/, " ")).squeeze(" ").strip
    return text if text.length <= LIMIT
    text[0, LIMIT].sub(/\s+\S*\z/, "") + "…"
  end
end

# post_convert runs after Markdown → HTML and before the layout (where {% seo %} reads it).
Jekyll::Hooks.register :posts, :post_convert do |post|
  post.data["description"] ||= AutoDescription.from_html(post.content)
end

# post_init: pages snapshot their data for Liquid before :pre_render, so set it on load.
Jekyll::Hooks.register :pages, :post_init do |page|
  next if page.data["description"] || page.data["layout"] != "posts_by_category"
  name = page.data["title"] || page.data["categories"]
  page.data["description"] = "Notes and fixes about #{name} from building and running production systems."
end
