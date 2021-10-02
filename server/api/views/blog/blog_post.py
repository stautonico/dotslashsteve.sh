#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# =============================================================================
# Filename: blog_post.py
# Author: Steve Tautonico
# Date Created: 10/1/21
# Python Version: 3.6 - 3.7
# =============================================================================
"""CRUD operations for BlogPost Objects"""
# =============================================================================
# Imports
# =============================================================================

from annoying.functions import get_object_or_None
from api.models import BlogPost, Tag
from django.forms.models import model_to_dict
from django.http import JsonResponse
from rest_framework.decorators import api_view
from  datetime import datetime


@api_view(["GET"])
def blog_post(request, title=None):
    if request.method == "GET":
        if not title:
            return JsonResponse({"message": "missing title"}, status=422)
        else:
            # Get the blog post
            object = get_object_or_None(BlogPost, title=title.lower().replace("_", " "))

            if not object:
                return JsonResponse({"message": "post not found"}, status=404)

            # Read the markdown file and inject into json payload
            with open(f"../blogposts/{object.markdown_file}", "r") as f:
                markdown_content = f.read()

            payload = model_to_dict(object)
            payload["content"] = markdown_content

            # Manually insert the date published because `model_to_dict` won't do it
            payload["date_published"] = object.date_published

            # Get the tags belonging to this post
            payload["tags"] = []
            tags = Tag.objects.filter(post_id=object.id)

            for tag in tags:
                payload["tags"].append(tag.name)

            return JsonResponse(payload)
