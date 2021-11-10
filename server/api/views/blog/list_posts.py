#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# =============================================================================
# Filename: blog_post.py
# Author: Steve Tautonico
# Date Created: 10/23/21
# Python Version: 3.6 - 3.7
# =============================================================================
"""Simple paginated listing for blog posts"""
# =============================================================================
# Imports
# =============================================================================

from api.models import BlogPost, Tag
from django.core.paginator import Paginator
from django.http import JsonResponse
from rest_framework.decorators import api_view


@api_view(["GET"])
def list_posts(request, limit=30, page=0):
    blog_posts = BlogPost.objects.order_by("date_published")

    objects = []

    for post in blog_posts:
        payload = {"id": post.id, "title": post.title, "date_published": post.date_published, "category": post.category, "tags": []}

        # Get the tags belonging to this post
        tags = Tag.objects.filter(post_id=post.id)

        for tag in tags:
            payload["tags"].append(tag.name)

        objects.append(payload)

    if not limit:
        return JsonResponse({"posts": objects})

    paginator = Paginator(objects, limit)

    return JsonResponse({"posts": list(paginator.get_page(page))})
