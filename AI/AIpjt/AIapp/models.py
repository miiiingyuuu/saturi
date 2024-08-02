from django.db import models

class AudioFile(models.Model):
    title = models.CharField(max_length=100)
    audio = models.FileField(upload_to='audios/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
