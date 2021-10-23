#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# =============================================================================
# Filename: urls.py
# Author: Steve Tautonico
# Date Created: 10/1/21
# Python Version: 3.6 - 3.7
# =============================================================================
"""Urls for the blog api"""
# =============================================================================
# Imports
# =============================================================================
from django.urls import path

from . import *

urlpatterns = [
    # We have 2 because title is optional
    path("post/", blog_post.blog_post),
    path("post/<title>", blog_post.blog_post),

    path("list/", list_posts.list_posts),
    path("list/<int:limit>/<int:page>", list_posts.list_posts)

]
