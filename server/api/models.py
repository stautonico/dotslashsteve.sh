from django.db import models


class BlogPost(models.Model):
    title = models.CharField(max_length=256, unique=True, null=False, blank=False)
    date_published = models.DateTimeField(auto_now_add=True, editable=True)
    category = models.CharField(max_length=128, unique=False, null=False, blank=False)
    markdown_file = models.CharField(max_length=512, unique=True, null=False, blank=False)

    # tags = models.ForeignKey(Tag, models.CASCADE, related_name="tags", null=True, blank=True)

    def __str__(self):
        return f"BlogPost({self.title})"

    def __repr__(self):
        return f"BlogPost({self.title})"

    class Meta:
        ordering = ["date_published"]


class Tag(models.Model):
    name = models.CharField(max_length=128, unique=False, null=False, blank=False)
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"Tag({self.name})"

    def __repr__(self):
        return f"Tag({self.name})"
