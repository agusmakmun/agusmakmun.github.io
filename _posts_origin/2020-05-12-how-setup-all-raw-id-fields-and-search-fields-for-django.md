---
layout: post
title:  "How to setup all raw_id_fields and search_fields for django"
date:   2020-05-12 20:24:00 +0700
categories: [python, django]
---

For example I have this 3 fields as `question_set`, `question` and `folder`.
I need to assign all of this fields into `raw_id_fields` inside the `admin.ModelAdmin` without add manually per-single fields.

the basic way to enable raw id fields inside the `admin.ModelAdmin` look like this;


```python
@admin.register(QuestionList, site=admin_site)
class QuestionListAdmin(admin.ModelAdmin):
    raw_id_fields = ('question_set', 'question', 'folder')    # manually
```

But, can I setup all that `OneToOneField` and `ForeignKey` fields automatically into `raw_id_fields` without add it manually?
such as applying the class mixin? sure can, to do it you can inspect the model,
and search through the fields for instances of `ForeignKey`,
and add the name to the tuple, for example with:


```python
class DefaultAdminMixin:
    """
    class mixin to setup default `raw_id_fields` and `search_fields`.
    """
    raw_id_fields = ()
    search_fields = ()

    def __init__(self, model, admin_site, *args, **kwargs):
        self.raw_id_fields = self.setup_raw_id_fields(model)
        self.search_fields = self.setup_search_fields(model)
        super().__init__(model, admin_site, *args, **kwargs)

    def setup_raw_id_fields(self, model):
        return tuple(
            f.name
            for f in model._meta.get_fields()
            if isinstance(f, ForeignKey) or isinstance(f, OneToOneField)
        )

    def setup_search_fields(self, model):
        return tuple(
            f.name
            for f in model._meta.get_fields()
            if isinstance(f, CharField) or isinstance(f, TextField)
        )
```


A `OneToOneField` is a subclass of a `ForeignKey`, so there is no need to make search for a `OneToOneField`.
and to implement it, you can follow this below example;


```python
@admin.register(QuestionList, site=admin_site)
class QuestionListAdmin(DefaultAdminMixin, admin.ModelAdmin):
    pass
```
