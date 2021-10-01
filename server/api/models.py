from django.db import models


class BlogPost(models.Model):
    title = models.CharField(max_length=256, unique=True, null=False, blank=False)
    publish_date = models.DateField(auto_now_add=True)
    category = models.CharField(max_length=128, unique=False, null=False, blank=False)
    markdown_file = models.CharField(max_length=512, unique=True, null=False, blank=False)

    def __str__(self):
        return f"BlogPost({self.title})"

    def __repr__(self):
        return f"BlogPost({self.title})"
