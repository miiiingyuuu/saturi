from django.urls import path
from . import views

app_name = 'audioapp'

urlpatterns = [
    path('', views.audio_list, name='audio_list'),
    path('upload/', views.upload_audio, name='upload_audio'),
    path('analyze/', views.analyze_audio, name='analyze_audio'),
]
