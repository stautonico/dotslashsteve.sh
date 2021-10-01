from django.urls import path, include

urlpatterns = [
    # *** Blog API ***
    path("blog/", include("api.views.blog.urls")),

]