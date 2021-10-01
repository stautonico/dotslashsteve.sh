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
from json import loads

from django.http import JsonResponse
from django.forms.models import model_to_dict
from rest_framework.decorators import api_view
from api.models import BlogPost


@api_view(["GET", "POST", "PATCH", "DELETE"])
def blog_post(request, title=None):
    if request.method == "GET":
        if not title:
            return JsonResponse({"message": "missing title"}, status=422)
        else:
            return JsonResponse({"message": "post"})