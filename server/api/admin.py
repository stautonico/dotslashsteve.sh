from django.contrib import admin

from .models import BlogPost, Tag


class TagAdmin(admin.StackedInline):
    model = Tag
    extra = 1
    max_num = 10
    fields = ["name"]


class BlogPostAdmin(admin.ModelAdmin):
    inlines = [TagAdmin]
    fields = ["title", "category", "markdown_file"]
    readonly_fields = ["date_published"]


admin.site.register(BlogPost, BlogPostAdmin)
