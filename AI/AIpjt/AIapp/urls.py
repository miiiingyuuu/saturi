from django.urls import path
from . import views

app_name = 'audioapp'

urlpatterns = [
    path('analyze/', views.analyze_audio, name='analyze_audio'),
]
